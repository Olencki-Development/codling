import { z } from 'zod';
/**
 * @class RouteType
 * @description A class instance contains all information about a route with validation schemas to ensure data integrity.
 * @see RouteFactory instance "route" to generate instances of this class
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
  params(params) {
    return new RouteType({
      ...this._def,
      params,
    });
  }
  /**
   * Assign a query to the route.
   */
  query(query) {
    return new RouteType({
      ...this._def,
      query,
    });
  }
  /**
   * Assign a body to the route.
   * @warn GET/HEAD method cannot have a body
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
