import type { Pathname } from './pathname.types.js';
import { RouteType } from './RouteType.js';
import { z } from 'zod';

export class RouteFactory {
  get<T_Pathname extends Pathname>(
    url: T_Pathname
  ): RouteType<'GET', T_Pathname> {
    return new RouteType({
      method: 'GET',
      pathname: url,
      query: z.undefined(),
      body: z.undefined(),
    });
  }

  post<T_Pathname extends Pathname>(
    url: T_Pathname
  ): RouteType<'POST', T_Pathname> {
    return new RouteType({
      method: 'POST',
      pathname: url,
      query: z.undefined(),
      body: z.undefined(),
    });
  }

  patch<T_Pathname extends Pathname>(
    url: T_Pathname
  ): RouteType<'PATCH', T_Pathname> {
    return new RouteType({
      method: 'PATCH',
      pathname: url,
      query: z.undefined(),
      body: z.undefined(),
    });
  }

  delete<T_Pathname extends Pathname>(
    url: T_Pathname
  ): RouteType<'DELETE', T_Pathname> {
    return new RouteType({
      method: 'DELETE',
      pathname: url,
      query: z.undefined(),
      body: z.undefined(),
    });
  }
}

export default new RouteFactory();
