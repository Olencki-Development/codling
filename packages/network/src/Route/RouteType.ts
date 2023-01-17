import type { Pathname } from './pathname.types.js';
import {
  RouteTypeDef,
  RouteMethod,
  RouteQuery,
  RouteBody,
} from './route.types.js';
import { z } from 'zod';

export class RouteType<
  T_Method extends RouteMethod = RouteMethod,
  T_Pathname extends Pathname = Pathname,
  T_Query extends RouteQuery = z.ZodUndefined,
  T_Body extends RouteBody = z.ZodUndefined
> {
  get requestSchema() {
    return z.object({
      method: RouteMethod,
      pathname: z.string(),
      params: z.record(z.string()),
      query: this._def.query,
      body: this._def.body,
    });
  }

  constructor(
    readonly _def: RouteTypeDef<T_Method, T_Pathname, T_Query, T_Body>
  ) {}

  query<T_NewQuery extends z.SomeZodObject>(query: T_NewQuery) {
    return new RouteType({
      ...this._def,
      query,
    });
  }

  body<T_NewBody extends z.ZodTypeAny>(body: T_NewBody) {
    if (['GET', 'HEAD'].includes(this._def.method.toUpperCase())) {
      throw new Error('Request with GET/HEAD method cannot have body.');
    }
    return new RouteType({
      ...this._def,
      body,
    });
  }
}
