import type { z } from 'zod';
import type { RouteTypeAny } from '../Route/route.types.js';
import type {
  InferRequestData,
  RequestDef,
  RequestResult,
} from './request.type.js';
import type { Pathname } from '../Route/pathname.types.js';
import { CodlingNetworkError, HttpClient } from '../index.js';
import { handleUnknownError } from '../handleUnknownError.js';
import { deepmerge } from 'deepmerge-ts';

export class RequestType<
  T_Route extends RouteTypeAny,
  T_Client extends HttpClient
> {
  constructor(readonly _def: RequestDef<T_Route, T_Client>) {}

  getData(): InferRequestData<T_Route> {
    const parsedData = this._def.route.requestSchema.parse(
      this._def.data
    ) as InferRequestData<T_Route>;
    return parsedData;
  }

  getUrl() {
    const parsedData = this.getData();

    const url = new URL(
      this._getFormattedPathname(parsedData),
      this._def.server._def.url
    );
    Object.entries(parsedData.query ?? {}).forEach(([key, value]) => {
      url.searchParams.set(key, encodeURIComponent(value as any));
    });

    return url;
  }

  async execute(
    fetch: typeof global.fetch,
    init?: Parameters<typeof global.fetch>[1]
  ): Promise<RequestResult<{ data: z.infer<T_Route['responseSchema']> }>> {
    const parsedData = this.getData();
    try {
      let mergedInit: RequestInit = deepmerge(
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

  protected _getFormattedPathname(data: InferRequestData<T_Route>) {
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
}
