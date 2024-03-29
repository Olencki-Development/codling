import type { RouteType } from '../Route/RouteType.js';
import type { z } from 'zod';
import type { RouteTypeAny } from '../Route/route.types.js';
import type { StatusHandlerFunc } from './types.js';
import type { HttpClient } from './index.js';

type EmptyTypes = Record<string, never> | undefined | never | null;

export type InferRequestData<R> = R extends RouteType<
  infer T_RouteMathod,
  infer T_Pathname,
  infer T_ParamsValue,
  infer T_Params,
  infer T_Query,
  infer T_Body,
  infer T_RouteResponse
>
  ? {
      params: z.output<T_Params>;
      query: z.output<T_Query>;
      body: z.output<T_Body>;
    }
  : Record<string, never>;

type InferRouteOptions<R> = R extends RouteType<
  infer T_RouteMathod,
  infer T_Pathname,
  infer T_ParamsValue,
  infer T_Params,
  infer T_Query,
  infer T_Body,
  infer T_RouteResponse
>
  ? {
      params: z.input<T_Params>;
      query: z.input<T_Query>;
      body: z.input<T_Body>;
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

export type RequestDef<
  T_Route extends RouteTypeAny,
  T_Client extends HttpClient
> = {
  route: T_Route;
  data: {
    [key in GetRequiredRouteFields<T_Route>]: InferRouteOptions<T_Route>[key];
  };
  statusHandlers: Map<number, StatusHandlerFunc>;
  server: T_Client;
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

// eslint-disable-next-line @typescript-eslint/ban-types
export type RequestResult<T extends Record<string, unknown> = {}> =
  | RequestResultFailed
  | (RequestResultSuccess & T);
