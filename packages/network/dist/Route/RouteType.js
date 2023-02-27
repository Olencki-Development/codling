import { z } from 'zod';
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
export class RouteType {
  constructor(_def) {
    this._def = _def;
  }
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
  hasPayload() {
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
  params(params) {
    return new RouteType({
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
  query(query) {
    return new RouteType({
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
  body(body) {
    if (['GET', 'HEAD'].includes(this._def.method.toUpperCase())) {
      throw new Error('Request with GET/HEAD method cannot have body.');
    }
    return new RouteType({
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
  response(response) {
    return new RouteType({
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
  implement(func) {
    const handler = async (options) => {
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
