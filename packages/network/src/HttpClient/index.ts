import type {
  HttpClientDef,
  HttpClientRequestArgs,
  StatusHandlerFunc,
} from './types.js';
import type { RouteTypeAny } from '../Route/route.types.js';
import { RequestType } from './Request.js';

export class HttpClient {
  readonly _statusHandlers = new Map<number, StatusHandlerFunc<any>>();

  constructor(readonly _def: HttpClientDef) {}

  onStatus<T extends Error | undefined | void = void>(
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
      data: {
        params: (maybeOptions as any)?.params ?? {},
        query: (maybeOptions as any)?.query,
        body: (maybeOptions as any)?.body,
      } as unknown as RequestType<R>['_def']['data'],
      statusHandlers: this._statusHandlers,
      server: this._def,
    });
  }
}
