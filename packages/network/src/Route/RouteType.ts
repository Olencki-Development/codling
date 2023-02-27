import { z, ZodObject, ZodString } from 'zod';
import type { HttpClient } from '../HttpClient/index.js';
import type { IDataCoder } from '../DataCoder/types.js';
import type { JSONDataCoder } from '../DataCoder/JSONDataCoder.js';
import type { Pathname } from './pathname.types.js';
import type {
  RouteTypeDef,
  RouteMethod,
  RouteQuery,
  RouteBody,
  RouteResponse,
  RouteParams,
} from './route.types.js';
import type {
  RouteHandler,
  RouteHandlerFunc,
  RouteHandlerInputOptions,
} from './routeHandler.types.js';

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
export class RouteType<
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
  constructor(
    readonly _def: RouteTypeDef<
      T_Method,
      T_Pathname,
      T_ParamsValue,
      T_Params,
      T_Query,
      T_Body,
      T_Response
    >
  ) {}

  /**
   * Helper to retrieve the method this route uses
   */
  get method() {
    return this._def.method;
  }

  /**
   * Helper to retrieve the pathname this route uses
   */
  get pathname() {
    return this._def.pathname;
  }

  /**
   * Helper to retrieve the generated parameter validation schema this route uses
   */
  get paramsSchema() {
    return this._def.params;
  }

  /**
   * Helper to retrieve the response validation schema this route uses
   */
  get responseSchema() {
    return this._def.response;
  }

  /**
   * Helper to retrieve the query validation schema this route uses
   */
  get querySchema() {
    return this._def.query;
  }

  /**
   * Helper to retrieve the body validation schema this route uses
   */
  get bodySchema() {
    return this._def.body;
  }

  /**
   * Helper to check if there is a payload to send
   * @returns {boolean} Value calculated by body schema being an instance of ZodUndefined
   */
  hasPayload(): boolean {
    return !(this._def.body instanceof z.ZodUndefined);
  }

  /**
   * Helper to retrieve the full request validation schema this route uses
   */
  get requestSchema() {
    return z.object({
      params: this.paramsSchema,
      query: this.querySchema,
      body: this.bodySchema,
    });
  }

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
  >(params: T_NewParams) {
    return new RouteType<
      T_Method,
      T_Pathname,
      T_NewParamsValue,
      T_NewParams,
      T_Query,
      T_Body,
      T_Response
    >({
      ...this._def,
      params,
    });
  }

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
  query<T_NewQuery extends RouteQuery>(query: T_NewQuery) {
    return new RouteType<
      T_Method,
      T_Pathname,
      T_ParamsValue,
      T_Params,
      T_NewQuery,
      T_Body,
      T_Response
    >({
      ...this._def,
      query,
    });
  }

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
  body<T_NewBody extends RouteBody>(body: T_NewBody) {
    if (['GET', 'HEAD'].includes(this._def.method.toUpperCase())) {
      throw new Error('Request with GET/HEAD method cannot have body.');
    }
    return new RouteType<
      T_Method,
      T_Pathname,
      T_ParamsValue,
      T_Params,
      T_Query,
      T_NewBody,
      T_Response
    >({
      ...this._def,
      body,
    });
  }

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
  response<T_NewResponse extends RouteResponse>(response: T_NewResponse) {
    return new RouteType<
      T_Method,
      T_Pathname,
      T_ParamsValue,
      T_Params,
      T_Query,
      T_Body,
      T_NewResponse
    >({
      ...this._def,
      response,
    });
  }

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
  implement(func: RouteHandlerFunc<this>): RouteHandler<this> {
    const handler = async (options: RouteHandlerInputOptions<this>) => {
      const result = await func({
        query: this._def.query.parse(options.query),
        body: this._def.body.parse(options.body),
        params: this._def.params.parse(options.params),
      });

      return this._def.response.parse(result);
    };
    handler.route = this;

    return handler;
  }
}
