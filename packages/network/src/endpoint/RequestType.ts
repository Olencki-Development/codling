import type { Pathname } from './pathname.types.js';
import type {
  RequestDef,
  RequestExecuteDef,
  RequestExecuteOptions,
  RequestMethod,
  EmptyZodObject,
} from './request.types.js';
import type { z } from 'zod';
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
    const paramInput: Record<string, unknown> = def.params ?? {};
    const query = qs.stringify(this.querySchema.parse(def.query ?? {}));
    const arrayPathnameParams = this.pathname.split('/');
    let url: string = arrayPathnameParams
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
    if (query.length) {
      url = `${url}?${query}`;
    }

    const body = JSON.stringify(this.bodySchema.parse(def.body));
    return processRequestToZodSchema(
      options.fetch(url, {
        headers: options.headers ?? undefined,
        body,
      }),
      this.responseSchema
    );
  }
}
