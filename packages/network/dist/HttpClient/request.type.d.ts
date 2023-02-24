import type { RouteType } from '../Route/RouteType.js';
import type { z } from 'zod';
import type { InferPathnameParams } from '../Route/pathname.types.js';
import type { RouteMethod, RouteTypeAny } from '../Route/route.types.js';
import type { HttpClientDef, StatusHandlerFunc } from './types.js';
type EmptyTypes = Record<string, never> | undefined | never | null;
type InferRouteOptions<R> = R extends RouteType<
  RouteMethod,
  infer P,
  infer Q,
  infer B
>
  ? {
      params: InferPathnameParams<P>;
      query: z.input<Q>;
      body: z.input<B>;
    }
  : never;
type GetRequiredRouteFields<R> = InferRouteOptions<R> extends Record<
  string,
  unknown
>
  ? {
      [K in keyof InferRouteOptions<R>]: InferRouteOptions<R>[K] extends EmptyTypes
        ? never
        : K;
    }[keyof InferRouteOptions<R>]
  : never;
export type RequestDef<R extends RouteTypeAny> = {
  route: R;
  data: {
    [key in GetRequiredRouteFields<R>]: InferRouteOptions<R>[key];
  };
  statusHandlers: Map<number, StatusHandlerFunc>;
  server: HttpClientDef;
};
export type RequestResultFailed = {
  success: false;
  error: Error | undefined;
  response: Awaited<ReturnType<typeof global.fetch>> | undefined;
};
export type RequestResultSuccess = {
  success: true;
  response: Awaited<ReturnType<typeof global.fetch>>;
};
export type RequestResult<T extends Record<string, unknown> = {}> =
  | RequestResultFailed
  | (RequestResultSuccess & T);
export {};
