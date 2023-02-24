import type { Pathname, InferPathnameParams } from './pathname.types.js';
import type {
  RouteTypeDef,
  RouteMethod,
  RouteQuery,
  RouteBody,
  RouteResponse,
} from './route.types.js';
import { z } from 'zod';
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
  get method(): T_Method;
  get pathname(): T_Pathname;
  get paramSchema(): z.ZodObject<InferPathnameParams<T_Pathname>>;
  get responseSchema(): T_Response;
  get querySchema(): T_Query;
  get bodySchema(): T_Body;
  query<T_NewQuery extends RouteQuery>(
    query: T_NewQuery
  ): RouteType<T_Method, T_Pathname, T_NewQuery, T_Body, T_Response>;
  body<T_NewBody extends RouteBody>(
    body: T_NewBody
  ): RouteType<T_Method, T_Pathname, T_Query, T_NewBody, T_Response>;
  response<T_NewResponse extends RouteResponse>(
    response: T_NewResponse
  ): RouteType<T_Method, T_Pathname, T_Query, T_Body, T_NewResponse>;
}
