import type {
  HttpClientDef,
  HttpClientRequestArgs,
  StatusHandlerFunc,
} from './types.js';
import type { RouteTypeAny } from '../Route/route.types.js';
import { RequestType } from './Request.js';
export declare class HttpClient {
  readonly _def: HttpClientDef;
  readonly _statusHandlers: Map<number, StatusHandlerFunc<any>>;
  constructor(_def: HttpClientDef);
  onStatus<T extends Error | undefined | void = void>(
    status: number,
    handler: StatusHandlerFunc<T>
  ): this;
  request<R extends RouteTypeAny>(
    route: R,
    ...[maybeOptions]: HttpClientRequestArgs<R>
  ): RequestType<R>;
}
