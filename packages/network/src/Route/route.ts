import type { Pathname } from './pathname.types.js';
import { RouteType } from './RouteType.js';
import { z } from 'zod';

export class RouteFactory {
  get<T_Pathname extends Pathname>(url: T_Pathname) {
    return new RouteType({
      method: 'GET',
      pathname: url,
      query: z.undefined(),
      body: z.undefined(),
      response: z.unknown(),
    });
  }

  post<T_Pathname extends Pathname>(url: T_Pathname) {
    return new RouteType({
      method: 'POST',
      pathname: url,
      query: z.undefined(),
      body: z.undefined(),
      response: z.unknown(),
    });
  }

  patch<T_Pathname extends Pathname>(url: T_Pathname) {
    return new RouteType({
      method: 'PATCH',
      pathname: url,
      query: z.undefined(),
      body: z.undefined(),
      response: z.unknown(),
    });
  }

  delete<T_Pathname extends Pathname>(url: T_Pathname) {
    return new RouteType({
      method: 'DELETE',
      pathname: url,
      query: z.undefined(),
      body: z.undefined(),
      response: z.unknown(),
    });
  }
}

export default new RouteFactory();
