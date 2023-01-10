import { RequestMethod } from './request.types.js';
import { z } from 'zod';
import qs from 'qs';
import { processRequestToZodSchema } from '../client/processRequestToZodSchema/index.js';
export class RequestType {
  get requestSchema() {
    return z.object({
      method: RequestMethod,
      pathname: z.string(),
      params: z.record(z.string()),
      query: this.querySchema,
      body: this.bodySchema,
    });
  }
  constructor(def) {
    this.method = def.method;
    this.pathname = def.pathname;
    this.querySchema = def.query;
    this.bodySchema = def.body;
    this.responseSchema = def.response;
  }
  query(query) {
    return new RequestType({
      method: this.method,
      pathname: this.pathname,
      query,
      body: this.bodySchema,
      response: this.responseSchema,
    });
  }
  body(body) {
    return new RequestType({
      method: this.method,
      pathname: this.pathname,
      query: this.querySchema,
      body,
      response: this.responseSchema,
    });
  }
  response(response) {
    return new RequestType({
      method: this.method,
      pathname: this.pathname,
      query: this.querySchema,
      body: this.bodySchema,
      response,
    });
  }
  async execute(def, options) {
    let url = this._getFormattedUrl(def.params);
    const query = this._getFormattedQuery(def.query);
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
        body: this._getFormattedBody(def.body, hasJsonContent),
      }),
      this.responseSchema
    );
  }
  _getFormattedUrl(params) {
    const paramInput = params ?? {};
    const arrayPathnameParams = this.pathname.split('/');
    return arrayPathnameParams
      .reduce((output, pathnamePiece) => {
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
  _getFormattedQuery(query) {
    return qs.stringify(this.querySchema.parse(query ?? {}));
  }
  _getFormattedBody(body, isJSON = false) {
    const parsedBody = this.bodySchema.parse(body);
    if (isJSON) {
      return JSON.stringify(parsedBody);
    }
    return parsedBody;
  }
}
