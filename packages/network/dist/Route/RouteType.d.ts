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
 * The main route definition class.
 *
 * This is used to create an instance of a route and contain all information about it: query, params, body, response, etc. The body, query, and params are dynamically extracted from {@link ZodType} instances.
 *
 * The `route` export is a default instance provided as an export.
 *
 * ### Example
 *
 * An example of what a create user request might look like.
 * ```ts
 * const req = route
 *   .post('/users/:userId/post')
 *   .body(z.object({
 *     name: z.string().trim().min(1),
 *     email: z.string().trim().email()
 *   }))
 *   .response(z.object({
 *     id: z.number().finite().min(0),
 *     name: z.string().trim().min(1),
 *     email: z.string().trim().email()
 *   }))
 *
 * ```
 *
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
  get paramsSchema(): T_Params;
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
   * Helper to check if there is a payload to send
   * @returns {boolean} Value calculated by body schema being an instance of ZodUndefined
   */
  hasPayload(): boolean;
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
   *
   * By default the params are expected to be an instance of {@link ZodString}. This method allows the param schema value to be overwritten.
   *
   * Only {@link ZodObject} is allowed for a params.
   *
   * ### Examples
   *
   * Ensure userId field is a numbers.
   * ```ts
   * route
   *   .get('/users/:userId/post')
   *   .params(z.object({
   *     userId: z.coerce.number()
   *   }))
   * ```
   *
   * If there are no params, do not allow this option.
   * ```ts
   * route
   *   .get('/users')
   *   .params(z.object({
   *     userId: z.coerce.number()
   *   })) // errors
   * ```
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
   *
   * Only {@link ZodObject} is allowed for a query.
   *
   * ### Example
   *
   * ```ts
   * route
   *   .get('/users')
   *   .query(z.object({
   *     sort: z.literal('desc')
   *   }))
   * ```
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
   *
   * **GET/HEAD method cannot have a body. It will throw.**
   *
   * ### Example
   *
   * ```ts
   * route
   *   .post('/users')
   *   .body(z.object({
   *     name: z.string()
   *   }))
   * ```
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
   *
   * This is the expected value from the route request.
   *
   * ### Examples
   *
   * Example with json response. Make sure {@link HttpClient} is using {@link JSONDataCoder}.
   * ```ts
   * route
   *   .post('/users')
   *   .body(z.object({
   *     name: z.string()
   *   }))
   *   .response(z.object({
   *     id: z.number(),
   *     name: z.string()
   *   }))
   * ```
   *
   * Example with custom response. Make sure to create a custom {@link IDataCoder} for use with {@link HttpClient}.
   * ```ts
   * route
   *   .post('/users')
   *   .body(z.object({
   *     name: z.string()
   *   }))
   *   .response(z.instanceOf(Buffer))
   * ```
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
   *
   * ### Example
   *
   * ```ts
   * routes
   *   .get('/users/:userId')
   *   .query(z.object({ sort: z.literal('desc') }))
   *   .response(z.object({ id: z.number() }))
   *   .implement(function (options) {
   *     options.params.userId // number
   *     options.query.sort // 'desc'
   *
   *     return {
   *       id: 1
   *     }
   *   })
   * ```
   */
  implement(func: RouteHandlerFunc<this>): RouteHandler<this>;
}
