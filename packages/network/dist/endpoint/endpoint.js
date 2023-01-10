import { RequestType } from './RequestType.js';
import { z } from 'zod';
export function get(url) {
  return new RequestType({
    method: 'GET',
    pathname: url,
    query: z.object({}),
    body: z.unknown(),
    response: z.unknown(),
  });
}
export function post(url) {
  return new RequestType({
    method: 'POST',
    pathname: url,
    query: z.object({}),
    body: z.unknown(),
    response: z.unknown(),
  });
}
export function patch(url) {
  return new RequestType({
    method: 'PATCH',
    pathname: url,
    query: z.object({}),
    body: z.unknown(),
    response: z.unknown(),
  });
}
export function del(url) {
  return new RequestType({
    method: 'DELETE',
    pathname: url,
    query: z.object({}),
    body: z.unknown(),
    response: z.unknown(),
  });
}
