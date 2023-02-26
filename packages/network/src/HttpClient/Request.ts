import type { z } from 'zod';
import type { RouteTypeAny } from '../Route/route.types.js';
import type {
  InferRequestData,
  RequestDef,
  RequestResult,
} from './request.type.js';
import type { Pathname } from '../Route/pathname.types.js';
import { CodlingNetworkError } from '../index.js';
import { handleUnknownError } from '../handleUnknownError.js';
import { deepmerge } from 'deepmerge-ts';

export class RequestType<R extends RouteTypeAny> {
  constructor(readonly _def: RequestDef<R>) {}

  getData(): InferRequestData<R> {
    const parsedData = this._def.route.requestSchema.parse(
      this._def.data
    ) as InferRequestData<R>;
    return parsedData;
  }

  getUrl() {
    const parsedData = this.getData();

    const url = new URL(
      this._getFormattedPathname(parsedData),
      this._def.server.url
    );
    Object.entries(parsedData.query ?? {}).forEach(([key, value]) => {
      url.searchParams.set(key, encodeURIComponent(value as any));
    });

    return url;
  }

  async execute(
    fetch: typeof global.fetch,
    init?: Parameters<typeof global.fetch>[1]
  ): Promise<RequestResult<{ data: z.infer<R['responseSchema']> }>> {
    try {
      let mergedInit = deepmerge(this._def.server.init ?? {}, init ?? {});
      mergedInit = deepmerge(mergedInit, {
        method: this._def.route.method,
        body: this._getBody(mergedInit.headers ?? {}),
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
          await this._fetchResponseData(response, mergedInit.headers ?? {})
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

  protected _getFormattedPathname(data: InferRequestData<R>) {
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

  protected _getBody(headers: HeadersInit) {
    const data = this.getData();
    if (!('body' in data)) {
      return undefined;
    }
    if (data.body == null) {
      return data.body;
    }

    const contentType =
      this._getHeader(headers, 'Content-Type') ??
      this._getHeader(headers, 'content-type');
    if (contentType?.includes('application/json')) {
      return JSON.stringify(data.body);
    }

    return data.body;
  }

  protected async _fetchResponseData(
    response: Response,
    requestHeaders: HeadersInit
  ) {
    const accepts =
      this._getHeader(requestHeaders, 'Accepts') ??
      this._getHeader(requestHeaders, 'accepts');
    if (accepts?.includes('application/json')) {
      return await response.json();
    }
    return await response.blob();
  }

  protected _getHeader(
    headers: HeadersInit,
    headerName: string
  ): string | null {
    if (Array.isArray(headers)) {
      return (
        headers.find(([name, value]) => {
          return name === headerName;
        })?.[1] ?? null
      );
    }

    const isHeaderInstance = (_headers: HeadersInit): _headers is Headers => {
      return 'get' in headers && typeof headers.get === 'function';
    };
    if (isHeaderInstance(headers)) {
      return headers.get(headerName) ?? null;
    }

    return headers[headerName] ?? null;
  }
}
