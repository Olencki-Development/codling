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
  route: R['_def'];
  data: {
    [key in GetRequiredRouteFields<R>]: InferRouteOptions<R>[key];
  };
  statusHandlers: Map<number, StatusHandlerFunc>;
  server: HttpClientDef;
};
export type RequestResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: Error | undefined;
    };
export {};
