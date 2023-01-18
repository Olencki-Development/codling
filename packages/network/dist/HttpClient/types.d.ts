import type { RouteTypeAny } from '../Route/route.types.js';
import type { RequestDef } from './request.type.js';
export type HttpClientDef = {
  url: string | URL;
  init?: Parameters<typeof fetch>[1];
};
export type MaybePromise<T> = T | Promise<T>;
export type StatusHandlerFunc<
  T extends Error | undefined | void = Error | undefined | void
> = (response: Response) => MaybePromise<T>;
export type HttpClientRequestArgs<R extends RouteTypeAny> =
  RequestDef<R>['data'] extends Record<string, never>
    ? []
    : [options: RequestDef<R>['data']];
