import { z } from 'zod';
import type { Pathname } from './pathname.types.js';
import type {
  RouteTypeDef,
  RouteMethod,
  RouteQuery,
  RouteBody,
  RouteResponse,
  RouteParams,
} from './route.types.js';
import type { RouteHandler, RouteHandlerFunc } from './routeHandler.types.js';
/**
 * @class RouteType
 * @description A class instance contains all information about a route with validation schemas to ensure data integrity.
 * @see RouteFactory instance "route" to generate instances of this class
 */
export declare class RouteType<
  T_Method extends RouteMethod = RouteMethod,
  T_Pathname extends Pathname = Pathname,
  T_ParamsValue extends z.ZodTypeAny = z.ZodString,
  T_Params extends RouteParams<T_Pathname, T_ParamsValue> = RouteParams<
    T_Pathname,
    T_ParamsValue
  >,
  T_Query extends RouteQuery = RouteQuery,
  T_Body extends RouteBody = RouteBody,
  T_Response extends RouteResponse = RouteResponse
> {
  readonly _def: RouteTypeDef<
    T_Method,
    T_Pathname,
    T_ParamsValue,
    T_Params,
    T_Query,
    T_Body,
    T_Response
  >;
  constructor(
    _def: RouteTypeDef<
      T_Method,
      T_Pathname,
      T_ParamsValue,
      T_Params,
      T_Query,
      T_Body,
      T_Response
    >
  );
  /**
   * Helper to retrieve the method this route uses
   */
  get method(): T_Method;
  /**
   * Helper to retrieve the pathname this route uses
   */
  get pathname(): T_Pathname;
  /**
   * Helper to retrieve the generated parameter validation schema this route uses
   */
  get paramSchema(): T_Params;
  /**
   * Helper to retrieve the response validation schema this route uses
   */
  get responseSchema(): T_Response;
  /**
   * Helper to retrieve the query validation schema this route uses
   */
  get querySchema(): T_Query;
  /**
   * Helper to retrieve the body validation schema this route uses
   */
  get bodySchema(): T_Body;
  /**
   * Helper to retrieve the full request validation schema this route uses
   */
  get requestSchema(): z.ZodObject<
    {
      params: T_Params;
      query: T_Query;
      body: T_Body;
    },
    'strip',
    z.ZodTypeAny,
    z.objectUtil.addQuestionMarks<{
      params: T_Params['_output'];
      query: T_Query['_output'];
      body: T_Body['_output'];
    }> extends infer T
      ? {
          [k_1 in keyof T]: z.objectUtil.addQuestionMarks<{
            params: T_Params['_output'];
            query: T_Query['_output'];
            body: T_Body['_output'];
          }>[k_1];
        }
      : never,
    z.objectUtil.addQuestionMarks<{
      params: T_Params['_input'];
      query: T_Query['_input'];
      body: T_Body['_input'];
    }> extends infer T_1
      ? {
          [k_3 in keyof T_1]: z.objectUtil.addQuestionMarks<{
            params: T_Params['_input'];
            query: T_Query['_input'];
            body: T_Body['_input'];
          }>[k_3];
        }
      : never
  >;
  /**
   * Assign a custom param parser to the route.
   */
  params<
    T_NewParamsValue extends z.ZodTypeAny,
    T_NewParams extends RouteParams<T_Pathname, T_NewParamsValue>
  >(
    params: T_NewParams
  ): RouteType<
    T_Method,
    T_Pathname,
    T_NewParamsValue,
    T_NewParams,
    T_Query,
    T_Body,
    T_Response
  >;
  /**
   * Assign a query to the route.
   */
  query<T_NewQuery extends RouteQuery>(
    query: T_NewQuery
  ): RouteType<
    T_Method,
    T_Pathname,
    T_ParamsValue,
    T_Params,
    T_NewQuery,
    T_Body,
    T_Response
  >;
  /**
   * Assign a body to the route.
   * @warn GET/HEAD method cannot have a body
   */
  body<T_NewBody extends RouteBody>(
    body: T_NewBody
  ): RouteType<
    T_Method,
    T_Pathname,
    T_ParamsValue,
    T_Params,
    T_Query,
    T_NewBody,
    T_Response
  >;
  /**
   * Assign a response to the route.
   */
  response<T_NewResponse extends RouteResponse>(
    response: T_NewResponse
  ): RouteType<
    T_Method,
    T_Pathname,
    T_ParamsValue,
    T_Params,
    T_Query,
    T_Body,
    T_NewResponse
  >;
  /**
   * Create an implementation method for this route.
   * @returns {function} A wrapped function that validates input and result values from the provided lambda. You also have access to the underlying route through the `route` property.
   */
  implement(func: RouteHandlerFunc<this>): RouteHandler<this>;
}
