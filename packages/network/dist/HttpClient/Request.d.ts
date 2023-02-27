import type { z } from 'zod';
import type { RouteTypeAny } from '../Route/route.types.js';
import type {
  InferRequestData,
  RequestDef,
  RequestResult,
} from './request.type.js';
import { HttpClient } from '../index.js';
/**
 * The main request class.
 *
 * This is responsible for executing a request to a {@link RouteType} with the provided data content. It will serialize the data for process by using the {@link IDataCoder} that was used on the {@link HttpClient}; and deserialize data from the response.
 *
 * Headers are deep marged then used on the request in this order: {@link IDataCoder} -> {@link HttpClient} -> {@link @RequestType}
 */
export declare class RequestType<
  T_Route extends RouteTypeAny,
  T_Client extends HttpClient
> {
  readonly _def: RequestDef<T_Route, T_Client>;
  constructor(_def: RequestDef<T_Route, T_Client>);
  /**
   * Return processed and validated request data.
   *
   * ### Example
   *
   * ```ts
   * const data = client.request(req, {
   *   params: {
   *     userId: '1'
   *   },
   *   query: {
   *     populate: true
   *   },
   *   body: {
   *     name: 'foo'
   *   }
   * }).getData()
   *
   * // data = { params: { userId: '1' }, query: { populate: true }, body: { name: 'foo' } }
   * ```
   */
  getData(): InferRequestData<T_Route>;
  /**
   * Retrieve the formatted URL with query and url params populated.
   *
   * ### Example
   *
   * ```ts
   * const url = client.request(req, {
   *   params: {
   *     userId: '1'
   *   },
   *   query: {
   *     populate: true
   *   },
   *   body: {
   *     name: 'foo'
   *   }
   * }).getUrl()
   *
   * // url instanceof URL
   * ```
   */
  getUrl(): URL;
  /**
   * Execute a request instance with the specified data.
   *
   * This should be provided an instance of {@link fetch} or {@link node-fetch}. There is an optional second param for request specific options. The method and payload are automatically populated to the request.
   *
   * ### Examples
   *
   * An example of a request that includes a body
   * ```ts
   * const result = await client.request(req, {
   *   body: {
   *     name: 'My name',
   *     email: 'test@gamil.com'
   *   }
   * }).execute(fetch)
   *
   * ```
   *
   * An example of a request that includes a query
   * ```ts
   * const result = await client.request(req, {
   *   query: {
   *     order: 'desc'
   *   }
   * }).execute(fetch)
   *
   * ```
   */
  execute(
    fetch: typeof global.fetch,
    init?: Parameters<typeof global.fetch>[1]
  ): Promise<
    RequestResult<{
      data: z.infer<T_Route['responseSchema']>;
    }>
  >;
  protected _getFormattedPathname(data: InferRequestData<T_Route>): string;
}
