import { RouteType } from './RouteType.js';
import { z } from 'zod';
/**
 * The main route generation class.
 *
 * There is a global instance `route` that is exported from this package.
 *
 * ### Examples
 *
 * A get request.
 * ```ts
 * const req = routes.get('/users')
 * ```
 *
 * A post request.
 * ```ts
 * const req = routes.post('/users')
 * ```
 *
 * A patch request.
 * ```ts
 * const req = routes.patch('/users')
 * ```
 *
 * A delete request.
 * ```ts
 * const req = routes.delete('/users')
 * ```
 *
 */
export class RouteFactory {
  /**
   * A helper method to generate a schema for parameters.
   *
   * ### Example
   *
   * ```ts
   * const paramsSchema = RouteFactory.getParamsSchema('/users/:userId')
   * // paramsSchema == z.object({ userId: z.string() })
   * ```
   */
  static getParamsSchema(pathname) {
    const arrayParamKeys = pathname.split('/').reduce((output, item) => {
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
    return paramSchema;
  }
  /**
   * Generate a GET request.
   *
   * This is a base GET request with no data being passed. The url can include params by using `:<my_param_name` format.
   *
   * #Examples
   *
   * Basic GET request.
   * ```ts
   * const req = routes.get('/users')
   * ```
   *
   * Basic GET request with params.
   * ```ts
   * const req = routes.get('/users/:userId')
   *
   * // contains { userId: string }
   * ```
   */
  get(url) {
    return new RouteType({
      method: 'GET',
      pathname: url,
      query: z.undefined(),
      body: z.undefined(),
      response: z.unknown(),
      params: RouteFactory.getParamsSchema(url),
    });
  }
  /**
   * Generate a POST request.
   *
   * This is a base POST request with no data being passed. The url can include params by using `:<my_param_name` format.
   *
   * #Examples
   *
   * Basic POST request.
   * ```ts
   * const req = routes.post('/users')
   * ```
   *
   * Basic POST request with params.
   * ```ts
   * const req = routes.post('/users/:userId')
   *
   * // contains { userId: string }
   * ```
   */
  post(url) {
    return new RouteType({
      method: 'POST',
      pathname: url,
      query: z.undefined(),
      body: z.undefined(),
      response: z.unknown(),
      params: RouteFactory.getParamsSchema(url),
    });
  }
  /**
   * Generate a PATCH request.
   *
   * This is a base PATCH request with no data being passed. The url can include params by using `:<my_param_name` format.
   *
   * #Examples
   *
   * Basic PATCH request.
   * ```ts
   * const req = routes.patch('/users')
   * ```
   *
   * Basic PATCH request with params.
   * ```ts
   * const req = routes.patch('/users/:userId')
   *
   * // contains { userId: string }
   * ```
   */
  patch(url) {
    return new RouteType({
      method: 'PATCH',
      pathname: url,
      query: z.undefined(),
      body: z.undefined(),
      response: z.unknown(),
      params: RouteFactory.getParamsSchema(url),
    });
  }
  /**
   * Generate a DELETE request.
   *
   * This is a base DELETE request with no data being passed. The url can include params by using `:<my_param_name` format.
   *
   * #Examples
   *
   * Basic DELETE request.
   * ```ts
   * const req = routes.delete('/users')
   * ```
   *
   * Basic DELETE request with params.
   * ```ts
   * const req = routes.delete('/users/:userId')
   *
   * // contains { userId: string }
   * ```
   */
  delete(url) {
    return new RouteType({
      method: 'DELETE',
      pathname: url,
      query: z.undefined(),
      body: z.undefined(),
      response: z.unknown(),
      params: RouteFactory.getParamsSchema(url),
    });
  }
}
export default new RouteFactory();
