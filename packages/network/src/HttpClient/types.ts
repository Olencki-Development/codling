import type { RouteTypeAny } from '../Route/route.types.js';
import type { RequestDef } from './request.type.js';

export type HttpClientDef = {
  url: string | URL;
};

export type MaybePromise<T> = T | Promise<T>;

export type StatusHandlerFunc<T extends Error | undefined = Error | undefined> =
  (response: Response) => MaybePromise<Error>;

export type HttpClientRequestArgs<R extends RouteTypeAny> =
  RequestDef<R>['data'] extends Record<string, never>
    ? []
    : [options: RequestDef<R>['data']];
