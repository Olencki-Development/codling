import type {
  HttpClientDef,
  HttpClientRequestArgs,
  StatusHandlerFunc,
} from './types.js';
import type { RouteTypeAny } from '../Route/route.types.js';
import { RequestType } from './Request.js';
import type { IDataCoder } from '../DataCoder/types.js';

export class HttpClient<T_Coder extends IDataCoder = IDataCoder> {
  readonly _statusHandlers = new Map<number, StatusHandlerFunc<any>>();

  constructor(readonly _def: HttpClientDef<T_Coder>) {}

  onStatus<T extends Error | undefined | void = void>(
    status: number,
    handler: StatusHandlerFunc<T>
  ) {
    this._statusHandlers.set(status, handler);
    return this;
  }

  request<R extends RouteTypeAny>(
    route: R,
    ...[maybeOptions]: HttpClientRequestArgs<R, this>
  ): RequestType<R, this> {
    return new RequestType<R, this>({
      route,
      data: {
        params: (maybeOptions as any)?.params ?? {},
        query: (maybeOptions as any)?.query,
        body: (maybeOptions as any)?.body,
      } as unknown as RequestType<R, this>['_def']['data'],
      statusHandlers: this._statusHandlers,
      server: this,
    });
  }
}
