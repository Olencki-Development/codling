import type { RouteTypeAny } from './route.types.js';
import type { z } from 'zod';
export type RouteHandlerInputOptions<T_Route extends RouteTypeAny> = {
  query: z.input<T_Route['_def']['query']>;
  body: z.input<T_Route['_def']['body']>;
  params: z.input<T_Route['_def']['params']>;
};
type RouteHandlerOptions<T_Route extends RouteTypeAny> = {
  query: z.infer<T_Route['_def']['query']>;
  body: z.infer<T_Route['_def']['body']>;
  params: z.infer<T_Route['_def']['params']>;
};
export type RouteHandlerInputFunc<T_Route extends RouteTypeAny> = (
  options: RouteHandlerInputOptions<T_Route>
) =>
  | Promise<z.input<T_Route['_def']['response']>>
  | z.infer<T_Route['_def']['response']>;
export type RouteHandlerFunc<T_Route extends RouteTypeAny> = (
  options: RouteHandlerOptions<T_Route>
) =>
  | Promise<z.input<T_Route['_def']['response']>>
  | z.input<T_Route['_def']['response']>;
type RouteHandlerProperties<T_Route extends RouteTypeAny> = {
  route: T_Route;
};
export type RouteHandler<T_Route extends RouteTypeAny> =
  RouteHandlerInputFunc<T_Route> & RouteHandlerProperties<T_Route>;
export {};
