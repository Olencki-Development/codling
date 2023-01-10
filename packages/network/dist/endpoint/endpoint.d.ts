import type { Pathname } from './pathname.types.js';
import { RequestType } from './RequestType.js';
export declare function get<T_Pathname extends Pathname>(
  url: T_Pathname
): RequestType<'GET', T_Pathname>;
export declare function post<T_Pathname extends Pathname>(
  url: T_Pathname
): RequestType<'POST', T_Pathname>;
export declare function patch<T_Pathname extends Pathname>(
  url: T_Pathname
): RequestType<'PATCH', T_Pathname>;
export declare function del<T_Pathname extends Pathname>(
  url: T_Pathname
): RequestType<'DELETE', T_Pathname>;
