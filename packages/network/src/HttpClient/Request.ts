import type { RouteTypeAny } from '../Route/route.types.js';
import type { RequestDef, RequestResult } from './request.type.js';
import { z } from 'zod';
import type { Pathname } from '../Route/pathname.types.js';
import qs from 'qs';
import { CodlingNetworkError } from '../index.js';
import { handleUnknownError } from '../handleUnknownError.js';
import { deepmerge } from 'deepmerge-ts';

export class RequestType<R extends RouteTypeAny> {
  constructor(readonly _def: RequestDef<R>) {}

  async execute<T = z.output<R['_def']['response']>>(
    fetch: typeof global.fetch,
    init?: Parameters<typeof global.fetch>[1]
  ): Promise<RequestResult<T>> {
    try {
      const parsedData = z
        .object({
          params: this._getParamSchema(),
          query: this._def.route.query,
          body: this._def.route.body,
        })
        .parse(this._def.data) as unknown as typeof this._def.data;

      const query = this._getQuery(parsedData);
      const url = `${this._getOrigin()}/${this._getFormattedPathname(
        parsedData
      )}${query?.length ? `?${query}` : ''}`;
      const body = this._getBody(parsedData);

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

  protected _getParamSchema() {
    const pathname: Pathname = this._def.route.pathname;

    const arrayParamKeys = pathname
      .split('/')
      .reduce((output: string[], item) => {
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

  protected _getFormattedPathname(data: typeof this._def.data) {
    const pathname: Pathname = this._def.route.pathname;

    return pathname
      .split('/')
      .reduce((output: string[], item) => {
        if (!item.length) {
          return output;
        }
        if (item.startsWith(':')) {
          const param = (data as any).params?.[item.slice(1)];
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

  protected _getQuery(data: typeof this._def.data) {
    if ('query' in data) {
      return qs.stringify(data.query);
    }

    return null;
  }

  protected _getBody(data: typeof this._def.data) {
    if ('body' in data && typeof data.body === 'object') {
      return JSON.stringify(data.body);
    }

    return undefined;
  }
}
