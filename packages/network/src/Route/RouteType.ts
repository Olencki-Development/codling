import type { Pathname } from './pathname.types.js';
import type {
  RouteTypeDef,
  RouteMethod,
  RouteQuery,
  RouteBody,
  RouteResponse,
} from './route.types.js';

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

  expectJSON<T_NewResponse extends RouteResponse>(response: T_NewResponse) {
    return new RouteType({
      ...this._def,
      response,
    });
  }
}
