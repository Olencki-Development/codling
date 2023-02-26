import type { IDataCoder } from '../DataCoder/types.js';
import type { RouteTypeAny } from '../Route/route.types.js';
import type { HttpClient } from './index.js';
import type { RequestDef } from './request.type.js';
export type HttpClientDef<T_Coder extends IDataCoder> = {
  url: string | URL;
  init?: Parameters<typeof fetch>[1];
  coder: T_Coder;
};
export type MaybePromise<T> = T | Promise<T>;
export type StatusHandlerFunc<
  T extends Error | undefined | void = Error | undefined | void
> = (response: Response) => MaybePromise<T>;
export type HttpClientRequestArgs<
  T_Route extends RouteTypeAny,
  T_Client extends HttpClient
> = RequestDef<T_Route, T_Client>['data'] extends Record<string, never>
  ? []
  : [options: RequestDef<T_Route, T_Client>['data']];
