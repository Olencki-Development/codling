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
import type {
  RouteHandler,
  RouteHandlerFunc,
  RouteHandlerInputOptions,
} from './routeHandler.types.js';

/**
 * @class RouteType
 * @description A class instance contains all information about a route with validation schemas to ensure data integrity.
 * @see RouteFactory instance "route" to generate instances of this class
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
  get paramSchema() {
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
   * Helper to retrieve the full request validation schema this route uses
   */
  get requestSchema() {
    return z.object({
      params: this.paramSchema,
      query: this.querySchema,
      body: this.bodySchema,
    });
  }

  /**
   * Assign a custom param parser to the route.
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
   * @warn GET/HEAD method cannot have a body
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
