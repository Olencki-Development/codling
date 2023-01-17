import type { RouteType } from '../Route/RouteType.js';
import type { z } from 'zod';
import type { InferPathnameParams } from '../Route/pathname.types.js';

export type HttpClientDef = string | URL;

export type MaybePromise<T> = T | Promise<T>;

export type StatusHandlerFunc<T = void> = (
  response: Response
) => MaybePromise<T>;

export type HttpClientRequestOptions = {
  fetch: typeof fetch;
  init?: Parameters<typeof fetch>[1];
};

export type InferRoute<R> = R extends RouteType<
  infer M,
  infer P,
  infer Q,
  infer B
>
  ? RouteType<M, P, Q, B>
  : never;

type EmptyTypes = Record<string, never> | undefined | never | null;

type InferRouteOptions<R> = R extends RouteType<
  infer M,
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

export type RouteRequestOptions<
  R,
  O = {
    [key in GetRequiredRouteFields<R>]: InferRouteOptions<R>[key];
  }
> = O extends Record<string, never> ? never : O;

export type HttpClientRequestArgs<R> = RouteRequestOptions<R> extends never
  ? []
  : [options: RouteRequestOptions<R>];
