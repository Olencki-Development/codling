import type { Pathname } from './pathname.types.js';
import type {
  RouteTypeDef,
  RouteMethod,
  RouteQuery,
  RouteBody,
  RouteResponse,
} from './route.types.js';
export declare class RouteType<
  T_Method extends RouteMethod = RouteMethod,
  T_Pathname extends Pathname = Pathname,
  T_Query extends RouteQuery = RouteQuery,
  T_Body extends RouteBody = RouteBody,
  T_Response extends RouteResponse = RouteResponse
> {
  readonly _def: RouteTypeDef<
    T_Method,
    T_Pathname,
    T_Query,
    T_Body,
    T_Response
  >;
  constructor(
    _def: RouteTypeDef<T_Method, T_Pathname, T_Query, T_Body, T_Response>
  );
  query<T_NewQuery extends RouteQuery>(
    query: T_NewQuery
  ): RouteType<T_Method, T_Pathname, T_NewQuery, T_Body, T_Response>;
  body<T_NewBody extends RouteBody>(
    body: T_NewBody
  ): RouteType<T_Method, T_Pathname, T_Query, T_NewBody, T_Response>;
  expectJSON<T_NewResponse extends RouteResponse>(
    response: T_NewResponse
  ): RouteType<T_Method, T_Pathname, T_Query, T_Body, T_NewResponse>;
}
