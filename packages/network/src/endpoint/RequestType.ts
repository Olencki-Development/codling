import type { Pathname } from './pathname.types.js';
import {
  RequestDef,
  RequestExecuteDef,
  RequestExecuteOptions,
  RequestMethod,
  EmptyZodObject,
  GetParamInput,
  GetQueryInput,
  GetBodyInput,
} from './request.types.js';
import { z } from 'zod';
import qs from 'qs';
import { processRequestToZodSchema } from '../client/processRequestToZodSchema/index.js';

export class RequestType<
  T_Method extends RequestMethod,
  T_Pathname extends Pathname,
  T_Query extends z.SomeZodObject = typeof EmptyZodObject,
  T_Body extends z.ZodTypeAny = z.ZodUnknown,
  T_Response extends z.ZodTypeAny = z.ZodUnknown
> {
  readonly method: T_Method;
  readonly pathname: T_Pathname;
  readonly querySchema: T_Query;
  readonly bodySchema: T_Body;
  readonly responseSchema: T_Response;

  get requestSchema() {
    return z.object({
      method: RequestMethod,
      pathname: z.string(),
      params: z.record(z.string()),
      query: this.querySchema,
      body: this.bodySchema,
    });
  }

  constructor(
    def: RequestDef<T_Method, T_Pathname, T_Query, T_Body, T_Response>
  ) {
    this.method = def.method;
    this.pathname = def.pathname;
    this.querySchema = def.query;
    this.bodySchema = def.body;
    this.responseSchema = def.response;
  }

  query<T_NewQuery extends z.SomeZodObject>(
    query: T_NewQuery
  ): RequestType<T_Method, T_Pathname, T_NewQuery, T_Body, T_Response> {
    return new RequestType({
      method: this.method,
      pathname: this.pathname,
      query,
      body: this.bodySchema,
      response: this.responseSchema,
    });
  }

  body<T_NewBody extends z.ZodTypeAny>(
    body: T_NewBody
  ): RequestType<T_Method, T_Pathname, T_Query, T_NewBody, T_Response> {
    if (this.method === 'GET') {
      throw new Error('Request with GET/HEAD method cannot have body.');
    }
    return new RequestType({
      method: this.method,
      pathname: this.pathname,
      query: this.querySchema,
      body,
      response: this.responseSchema,
    });
  }

  response<T_NewResponse extends z.ZodTypeAny>(
    response: T_NewResponse
  ): RequestType<T_Method, T_Pathname, T_Query, T_Body, T_NewResponse> {
    return new RequestType({
      method: this.method,
      pathname: this.pathname,
      query: this.querySchema,
      body: this.bodySchema,
      response,
    });
  }

  async execute(
    def: RequestExecuteDef<T_Pathname, T_Query, T_Body>,
    options: RequestExecuteOptions
  ): Promise<z.output<T_Response>> {
    let url = this._getFormattedUrl(def.params);
    const query = this._getFormattedQuery(
      def.query as GetQueryInput<T_Query> | undefined
    );
    if (query.length) {
      url = `${url}?${query}`;
    }

    if (options.server) {
      url = `${options.server}${url}`;
    }

    const hasJsonContent =
      options.headers?.['Content-Type'].toLowerCase() === 'application/json';
    return processRequestToZodSchema(
      options.fetch(url, {
        headers: options.headers ?? undefined,
        body:
          this.method === 'GET'
            ? undefined
            : this._getFormattedBody(def.body, hasJsonContent),
      }),
      this.responseSchema
    );
  }

  protected _getFormattedUrl(params?: GetParamInput<T_Pathname>): Pathname {
    const paramInput: Record<string, unknown> = params ?? {};
    const arrayPathnameParams = this.pathname.split('/');
    return arrayPathnameParams
      .reduce((output: string[], pathnamePiece) => {
        if (pathnamePiece.startsWith(':')) {
          const param = paramInput[pathnamePiece.replace(':', '')];
          output.push(`${param}`);
        } else {
          output.push(pathnamePiece);
        }
        return output;
      }, [])
      .join('/');
  }

  protected _getFormattedQuery(query?: GetQueryInput<T_Query>): string {
    return qs.stringify(this.querySchema.parse(query ?? {}));
  }

  protected _getFormattedBody(
    body: GetBodyInput<T_Body>,
    isJSON = false
  ): string {
    const parsedBody = this.bodySchema.parse(body);
    if (isJSON) {
      return JSON.stringify(parsedBody);
    }
    return parsedBody;
  }
}
