import type { RouteTypeAny } from '../Route/route.types.js';
import type { RequestDef, RequestResult } from './request.type.js';
import type { z } from 'zod';
import type { Pathname } from '../Route/pathname.types.js';
import qs from 'qs';
import { CodlingNetworkError } from '../index.js';
import { handleUnknownError } from '../handleUnknownError.js';

export class RequestType<R extends RouteTypeAny> {
  constructor(readonly _def: RequestDef<R>) {}

  async execute<T = z.output<R['_def']['response']>>(
    fetch: typeof global.fetch,
    init?: Parameters<typeof global.fetch>[1]
  ): Promise<RequestResult<T>> {
    try {
      const query = this._getQuery();
      const url = `${this._getOrigin()}/${this._getFormattedPathname()}${
        query?.length ? `?${query}` : ''
      }`;

      const response = await fetch(url, {
        ...init,
        method: this._def.route.method,
        body: this._getBody(),
      });

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
          error: await statusHandler(response),
        };
      }

      const json = await response.json();
      return {
        success: true,
        data: (this._def.route.response
          ? this._def.route.response.parse(json)
          : json) as T,
      };
    } catch (e) {
      return {
        success: false,
        error: handleUnknownError(e),
      };
    }
  }

  protected _getFormattedPathname() {
    const pathname: Pathname = this._def.route.pathname;

    return pathname
      .split('/')
      .reduce((output: string[], item) => {
        if (!item.length) {
          return output;
        }
        if (item.startsWith(':')) {
          const param = (this._def.data as any).params?.[item.slice(1)];
          output.push(param);
        } else {
          output.push(item);
        }

        return output;
      }, [])
      .join('/');
  }

  protected _getOrigin() {
    if (this._def.server.url instanceof URL) {
      return this._def.server.url.origin;
    }

    return this._def.server.url.endsWith('/')
      ? this._def.server.url.slice(0, -1)
      : this._def.server.url;
  }

  protected _getQuery() {
    if ('query' in this._def.data) {
      return qs.stringify(this._def.data.query);
    }

    return null;
  }

  protected _getBody() {
    if ('body' in this._def.data && typeof this._def.data.body === 'object') {
      return JSON.stringify(this._def.data.body);
    }

    return undefined;
  }
}
