/* eslint-disable @typescript-eslint/ban-types */
import { z, ZodNever, ZodString } from 'zod';
import type { InferPathnameParams, Pathname } from './pathname.types.js';
import type { RouteType } from './RouteType.js';

export const RouteMethod = z.enum(['GET', 'POST', 'PATCH', 'DELETE']);
export type RouteMethod = z.infer<typeof RouteMethod>;

export type RouteQuery = z.SomeZodObject | z.ZodUndefined;
export type RouteBody = z.ZodTypeAny;
export type RouteParams<
  T_Pathname extends Pathname,
  T_ParamsValue extends z.ZodTypeAny
> = InferPathnameParams<T_Pathname> extends Record<string, never>
  ? z.ZodRecord<ZodString, ZodNever>
  : z.ZodObject<{
      [key in keyof InferPathnameParams<T_Pathname>]: T_ParamsValue;
    }>;

export type RouteResponse = z.ZodTypeAny;

export type RouteTypeDef<
  T_Method extends RouteMethod,
  T_Pathname extends Pathname,
  T_ParamValue extends z.ZodTypeAny,
  T_Params extends RouteParams<T_Pathname, T_ParamValue>,
  T_Query extends RouteQuery,
  T_Body extends RouteBody,
  T_Response extends RouteResponse
> = {
  method: T_Method;
  pathname: T_Pathname;
  params: T_Params;
  query: T_Query;
  body: T_Body;
  response: T_Response;
};

export type RouteTypeAny = RouteType<any, any, any, any, any, any, any>;
