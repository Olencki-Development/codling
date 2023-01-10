import type { Pathname } from './pathname.types.js';
import { RequestType } from './RequestType.js';
import { z } from 'zod';

export function get<T_Pathname extends Pathname>(
  url: T_Pathname
): RequestType<'GET', T_Pathname> {
  return new RequestType({
    method: 'GET',
    pathname: url,
    query: z.object({}),
    body: z.unknown(),
    response: z.unknown(),
  });
}

export function post<T_Pathname extends Pathname>(
  url: T_Pathname
): RequestType<'POST', T_Pathname> {
  return new RequestType({
    method: 'POST',
    pathname: url,
    query: z.object({}),
    body: z.unknown(),
    response: z.unknown(),
  });
}

export function patch<T_Pathname extends Pathname>(
  url: T_Pathname
): RequestType<'PATCH', T_Pathname> {
  return new RequestType({
    method: 'PATCH',
    pathname: url,
    query: z.object({}),
    body: z.unknown(),
    response: z.unknown(),
  });
}

export function del<T_Pathname extends Pathname>(
  url: T_Pathname
): RequestType<'DELETE', T_Pathname> {
  return new RequestType({
    method: 'DELETE',
    pathname: url,
    query: z.object({}),
    body: z.unknown(),
    response: z.unknown(),
  });
}
