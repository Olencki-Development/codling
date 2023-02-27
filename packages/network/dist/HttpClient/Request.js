import { CodlingNetworkError } from '../index.js';
import { handleUnknownError } from '../handleUnknownError.js';
import { deepmerge } from 'deepmerge-ts';
/**
 * The main request class.
 *
 * This is responsible for executing a request to a {@link RouteType} with the provided data content. It will serialize the data for process by using the {@link IDataCoder} that was used on the {@link HttpClient}; and deserialize data from the response.
 *
 * Headers are deep marged then used on the request in this order: {@link IDataCoder} -> {@link HttpClient} -> {@link @RequestType}
 */
export class RequestType {
  constructor(_def) {
    this._def = _def;
  }
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
  getData() {
    const parsedData = this._def.route.requestSchema.parse(this._def.data);
    return parsedData;
  }
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
  getUrl() {
    const parsedData = this.getData();
    const url = new URL(
      this._getFormattedPathname(parsedData),
      this._def.server._def.url
    );
    Object.entries(parsedData.query ?? {}).forEach(([key, value]) => {
      url.searchParams.set(key, encodeURIComponent(value));
    });
    return url;
  }
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
  async execute(fetch, init) {
    const parsedData = this.getData();
    try {
      let mergedInit = deepmerge(
        { headers: this._def.server._def.coder.getHeaders() },
        this._def.server._def.init ?? {},
        init ?? {}
      );
      mergedInit = deepmerge(mergedInit, {
        method: this._def.route.method,
        body: await this._def.server._def.coder.encode(parsedData.body),
      });
      const response = await fetch(this.getUrl(), mergedInit);
      if (!response.ok) {
        const statusHandler = this._def.statusHandlers.get(response.status);
        if (!statusHandler) {
          return {
            success: false,
            error: new CodlingNetworkError(
              'An unknown network error has occured.',
              response
            ),
            response,
          };
        }
        return {
          success: false,
          error: (await statusHandler(response)) ?? undefined,
          response,
        };
      }
      return {
        success: true,
        response,
        data: this._def.route.responseSchema.parse(
          await this._def.server._def.coder.decode(await response.blob())
        ),
      };
    } catch (e) {
      return {
        success: false,
        error: handleUnknownError(e),
        response: undefined,
      };
    }
  }
  _getFormattedPathname(data) {
    const pathname = this._def.route.pathname;
    return pathname
      .split('/')
      .reduce((output, item) => {
        if (!item.length) {
          return output;
        }
        if (item.startsWith(':')) {
          const param = data.params?.[item.slice(1)];
          output.push(param);
        } else {
          output.push(item);
        }
        return output;
      }, [])
      .join('/');
  }
}
