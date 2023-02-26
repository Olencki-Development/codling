import { CodlingNetworkError } from '../index.js';
import { handleUnknownError } from '../handleUnknownError.js';
import { deepmerge } from 'deepmerge-ts';
export class RequestType {
  constructor(_def) {
    this._def = _def;
  }
  getData() {
    const parsedData = this._def.route.requestSchema.parse(this._def.data);
    return parsedData;
  }
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
