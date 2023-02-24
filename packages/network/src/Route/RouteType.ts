import type { Pathname, InferPathnameParams } from './pathname.types.js';
import type {
  RouteTypeDef,
  RouteMethod,
  RouteQuery,
  RouteBody,
  RouteResponse,
} from './route.types.js';
import { z } from 'zod';

export class RouteType<
  T_Method extends RouteMethod = RouteMethod,
  T_Pathname extends Pathname = Pathname,
  T_Query extends RouteQuery = RouteQuery,
  T_Body extends RouteBody = RouteBody,
  T_Response extends RouteResponse = RouteResponse
> {
  constructor(
    readonly _def: RouteTypeDef<
      T_Method,
      T_Pathname,
      T_Query,
      T_Body,
      T_Response
    >
  ) {}

  get method() {
    return this._def.method;
  }

  get pathname() {
    return this._def.pathname;
  }

  get paramSchema(): z.ZodObject<InferPathnameParams<T_Pathname>> {
    const pathname: Pathname = this._def.pathname;

    const arrayParamKeys = pathname
      .split('/')
      .reduce((output: string[], item) => {
        if (!item.length) {
          return output;
        }
        if (item.startsWith(':')) {
          output.push(item.slice(1));
        }

        return output;
      }, []);

    let paramSchema = z.object({});
    for (const paramKey of arrayParamKeys) {
      paramSchema = paramSchema.setKey(paramKey, z.string().min(1).trim());
    }

    return paramSchema as z.ZodObject<InferPathnameParams<T_Pathname>>;
  }

  get responseSchema() {
    return this._def.response;
  }

  get querySchema() {
    return this._def.query;
  }

  get bodySchema() {
    return this._def.body;
  }

  query<T_NewQuery extends RouteQuery>(query: T_NewQuery) {
    return new RouteType({
      ...this._def,
      query,
    });
  }

  body<T_NewBody extends RouteBody>(body: T_NewBody) {
    if (['GET', 'HEAD'].includes(this._def.method.toUpperCase())) {
      throw new Error('Request with GET/HEAD method cannot have body.');
    }
    return new RouteType({
      ...this._def,
      body,
    });
  }

  response<T_NewResponse extends RouteResponse>(response: T_NewResponse) {
    return new RouteType({
      ...this._def,
      response,
    });
  }
}
