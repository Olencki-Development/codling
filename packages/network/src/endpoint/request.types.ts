/* eslint-disable @typescript-eslint/ban-types */
import { z } from 'zod';
import type { Pathname, RequestParams } from './pathname.types.js';

export const RequestMethod = z.enum(['GET', 'POST', 'PATCH', 'DELETE']);
export type RequestMethod = z.infer<typeof RequestMethod>;

export type RequestDef<
  T_Method extends RequestMethod,
  T_Pathname extends Pathname,
  T_Query extends z.SomeZodObject,
  T_Body extends z.ZodTypeAny,
  T_Response extends z.ZodTypeAny
> = {
  method: T_Method;
  pathname: T_Pathname;
  query: T_Query;
  body: T_Body;
  response: T_Response;
};

export const EmptyZodObject = z.object({});
export type EmptyZodObject = z.infer<typeof EmptyZodObject>;

export type GetParamInput<T_Pathname extends Pathname> =
  RequestParams<T_Pathname> extends Record<string, never>
    ? { params?: {} }
    : { params: RequestParams<T_Pathname> };
export type GetQueryInput<T_Query extends z.SomeZodObject> =
  T_Query extends EmptyZodObject ? { query?: {} } : { query: z.input<T_Query> };
export type GetBodyInput<T_Body extends z.ZodTypeAny> =
  T_Body extends z.ZodUnknown ? { body?: unknown } : { body: z.input<T_Body> };

export type RequestExecuteDef<
  T_Pathname extends Pathname,
  T_Query extends z.SomeZodObject,
  T_Body extends z.ZodTypeAny
> = GetParamInput<T_Pathname> & GetQueryInput<T_Query> & GetBodyInput<T_Body>;

export type RequestExecuteOptions = {
  server?: string;
  fetch: typeof fetch;
  headers?: Record<string, string>;
};

export type RequestImplementReq<
  T_Pathname extends Pathname,
  T_Query extends z.SomeZodObject,
  T_Body extends z.ZodTypeAny
> = {
  params: RequestParams<T_Pathname>;
  query: z.output<T_Query>;
  body: z.output<T_Body>;
};
