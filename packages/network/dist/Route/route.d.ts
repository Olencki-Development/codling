import type { Pathname } from './pathname.types.js';
import { RouteType } from './RouteType.js';
import { z } from 'zod';
export declare class RouteFactory {
  get<T_Pathname extends Pathname>(
    url: T_Pathname
  ): RouteType<'GET', T_Pathname, z.ZodUndefined, z.ZodUndefined, z.ZodUnknown>;
  post<T_Pathname extends Pathname>(
    url: T_Pathname
  ): RouteType<
    'POST',
    T_Pathname,
    z.ZodUndefined,
    z.ZodUndefined,
    z.ZodUnknown
  >;
  patch<T_Pathname extends Pathname>(
    url: T_Pathname
  ): RouteType<
    'PATCH',
    T_Pathname,
    z.ZodUndefined,
    z.ZodUndefined,
    z.ZodUnknown
  >;
  delete<T_Pathname extends Pathname>(
    url: T_Pathname
  ): RouteType<
    'DELETE',
    T_Pathname,
    z.ZodUndefined,
    z.ZodUndefined,
    z.ZodUnknown
  >;
}
declare const _default: RouteFactory;
export default _default;
