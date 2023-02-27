import { RequestType } from './Request.js';
/**
 * The main http client.
 *
 * There can be multiple instances of an {@link HttpClient} in an application to support different data response types. Each instance takes a url and {@link IDataCoder}.
 *
 * ### Examples
 *
 * This example provides a client that handles `application/json` with the {@link JSONDataCoder} pointed to `http://localhost:8000`.
 * ```ts
 * const client = new HttpClient({
 *   url: 'http://localhost:8000',
 *   coder: new JSONDataCoder()
 * })
 * ```
 *
 * This example provides a client that handles `application/json` with the {@link JSONDataCoder} pointed to `http://localhost:8000` with global client instance headers.
 * ```ts
 * const client = new HttpClient({
 *   url: 'http://localhost:8000',
 *   coder: new JSONDataCoder(),
 *   init: {
 *     headers: {
 *       'Authentication': `Bearer ${myAuthToken}`
 *     }
 *   }
 * })
 * ```
 */
export class HttpClient {
  constructor(_def) {
    this._def = _def;
    this._statusHandlers = new Map();
  }
  /**
   * A method to provide client instance global http status error mapping.
   *
   * ### Examples
   *
   * Remove a cookie on 403 responses from the server
   * ```ts
   * client.onStatus(403, (response) => {
   *   // gain access to cookies some how
   *   cookies.delete('token');
   * })
   * ```
   */
  onStatus(status, handler) {
    this._statusHandlers.set(status, handler);
    return this;
  }
  /**
   * The main method to initiate an execution of a {@link RouteType} instance.
   *
   * The method will dynamically inform you as to what url parameters, query values, and body content is required. If none are required, no second argument is expected.
   *
   * ### Examples
   *
   * Start execution of a request that expects nothing.
   * ```ts
   * const req = routes.get('/users')
   *
   * client.request(req)
   * ```
   *
   * Start execution of a request that expects a url param.
   * ```ts
   * const req = routes.get('/users/:userId')
   *
   * client.request(req, {
   *   params: {
   *     userId: '1'
   *   }
   * })
   * ```
   *
   * Start execution of a request that expects a url param and query.
   * ```ts
   * const req = routes.get('/posts/:postId/comments').query(z.object({
   *   sort: z.literal('desc')
   * }))
   *
   * client.request(req, {
   *   params: {
   *     userId: '1'
   *   },
   *   query: {
   *     sort: 'desc'
   *   }
   * })
   * ```
   *
   * Start execution of a request that expects a json body.
   * ```ts
   * const req = routes.post('/users').body(z.object({
   *   name: z.string().trim().min(1),
   *   email: z.string().trim().email()
   * }))
   *
   * client.request(req, {
   *   body: {
   *     name: 'My name',
   *     email: 'test@gmail.com'
   *   }
   * })
   * ```
   */
  request(route, ...[maybeOptions]) {
    return new RequestType({
      route,
      data: {
        params: maybeOptions?.params ?? {},
        query: maybeOptions?.query,
        body: maybeOptions?.body,
      },
      statusHandlers: this._statusHandlers,
      server: this,
    });
  }
}
