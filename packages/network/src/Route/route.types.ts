/* eslint-disable @typescript-eslint/ban-types */
import { z } from 'zod';
import type { Pathname } from './pathname.types.js';
import type { RouteType } from './RouteType.js';

export const RouteMethod = z.enum(['GET', 'POST', 'PATCH', 'DELETE']);
export type RouteMethod = z.infer<typeof RouteMethod>;

export type RouteQuery = z.SomeZodObject | z.ZodUndefined;
export type RouteBody = z.ZodTypeAny;

export type RouteResponse = z.SomeZodObject | z.ZodUnknown;

export type RouteTypeDef<
  T_Method extends RouteMethod,
  T_Pathname extends Pathname,
  T_Query extends RouteQuery,
  T_Body extends RouteBody,
  T_Response extends RouteResponse
> = {
  method: T_Method;
  pathname: T_Pathname;
  query: T_Query;
  body: T_Body;
  response: T_Response;
};

export type RouteTypeAny = RouteType<any, any, any, any, any>;
