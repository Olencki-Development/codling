import qs from 'qs';
import { CodlingNetworkError } from '../index.js';
import { handleUnknownError } from '../handleUnknownError.js';
import { deepmerge } from 'deepmerge-ts';
export class RequestType {
  constructor(_def) {
    this._def = _def;
  }
  async execute(fetch, init) {
    try {
      const query = this._getQuery();
      const url = `${this._getOrigin()}/${this._getFormattedPathname()}${
        query?.length ? `?${query}` : ''
      }`;
      const body = this._getBody();
      const mergedInit = deepmerge(this._def.server.init ?? {}, init ?? {}, {
        method: this._def.route.method,
        body,
      });
      const response = await fetch(url, mergedInit);
      if (!response.ok) {
        const statusHandler = this._def.statusHandlers.get(response.status);
        if (!statusHandler) {
          return {
            success: false,
            error: new CodlingNetworkError(
              'An unknown network error has occured.',
              response
            ),
          };
        }
        return {
          success: false,
          error: (await statusHandler(response)) ?? undefined,
        };
      }
      const json = await response.json();
      return {
        success: true,
        data: this._def.route.response
          ? this._def.route.response.parse(json)
          : json,
      };
    } catch (e) {
      return {
        success: false,
        error: handleUnknownError(e),
      };
    }
  }
  _getFormattedPathname() {
    const pathname = this._def.route.pathname;
    return pathname
      .split('/')
      .reduce((output, item) => {
        if (!item.length) {
          return output;
        }
        if (item.startsWith(':')) {
          const param = this._def.data.params?.[item.slice(1)];
          output.push(param);
        } else {
          output.push(item);
        }
        return output;
      }, [])
      .join('/');
  }
  _getOrigin() {
    if (this._def.server.url instanceof URL) {
      return this._def.server.url.origin;
    }
    return this._def.server.url.endsWith('/')
      ? this._def.server.url.slice(0, -1)
      : this._def.server.url;
  }
  _getQuery() {
    if ('query' in this._def.data) {
      return qs.stringify(this._def.data.query);
    }
    return null;
  }
  _getBody() {
    if ('body' in this._def.data && typeof this._def.data.body === 'object') {
      return JSON.stringify(this._def.data.body);
    }
    return undefined;
  }
}
