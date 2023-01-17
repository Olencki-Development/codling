import type {
  HttpClientDef,
  HttpClientRequestArgs,
  StatusHandlerFunc,
} from './types.js';
import type { RouteTypeAny } from '../Route/route.types.js';
import { RequestType } from './Request.js';
import type { RequestDef } from './request.type.js';
import type { Pathname } from '../Route/pathname.types.js';
import { z } from 'zod';

export class HttpClient {
  readonly _statusHandlers = new Map<number, StatusHandlerFunc<any>>();

  constructor(readonly _def: HttpClientDef) {}

  onStatus<T extends Error | undefined = undefined>(
    status: number,
    handler: StatusHandlerFunc<T>
  ) {
    this._statusHandlers.set(status, handler);
    return this;
  }

  request<R extends RouteTypeAny>(
    route: R,
    ...[maybeOptions]: HttpClientRequestArgs<R>
  ) {
    return new RequestType<R>({
      route: route._def,
      data: z
        .object({
          params: this._getParamSchema(route),
          query: route._def.query,
          body: route._def.body,
        })
        .parse({
          params: (maybeOptions as any)?.params ?? {},
          query: (maybeOptions as any)?.query,
          body: (maybeOptions as any)?.body,
        }) as unknown as RequestDef<R>['data'],
      statusHandlers: this._statusHandlers,
      server: this._def,
    });
  }

  protected _getParamSchema(route: RouteTypeAny) {
    const pathname: Pathname = route._def.pathname;

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
}
