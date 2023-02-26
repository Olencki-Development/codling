import type { Pathname } from './pathname.types.js';
import { RouteType } from './RouteType.js';
import { z } from 'zod';
import type { RouteParams } from './route.types.js';

export class RouteFactory {
  static getParamsSchema<T_Pathname extends Pathname>(
    pathname: T_Pathname
  ): RouteParams<T_Pathname, z.ZodString> {
    const arrayParamKeys = pathname
      .split('/')
      .reduce((output: string[], item) => {
        if (!item.length) {
          return output;
        }
        if (item.startsWith(':')) {
          output.push(item.slice(1));
        }

        return output;
      }, []);

    let paramSchema = z.object({});
    for (const paramKey of arrayParamKeys) {
      paramSchema = paramSchema.setKey(paramKey, z.string().min(1).trim());
    }

    return paramSchema as RouteParams<T_Pathname, z.ZodString>;
  }

  get<T_Pathname extends Pathname>(url: T_Pathname) {
    return new RouteType({
      method: 'GET',
      pathname: url,
      query: z.undefined(),
      body: z.undefined(),
      response: z.unknown(),
      params: RouteFactory.getParamsSchema(url),
    });
  }

  post<T_Pathname extends Pathname>(url: T_Pathname) {
    return new RouteType({
      method: 'POST',
      pathname: url,
      query: z.undefined(),
      body: z.undefined(),
      response: z.unknown(),
      params: RouteFactory.getParamsSchema(url),
    });
  }

  patch<T_Pathname extends Pathname>(url: T_Pathname) {
    return new RouteType({
      method: 'PATCH',
      pathname: url,
      query: z.undefined(),
      body: z.undefined(),
      response: z.unknown(),
      params: RouteFactory.getParamsSchema(url),
    });
  }

  delete<T_Pathname extends Pathname>(url: T_Pathname) {
    return new RouteType({
      method: 'DELETE',
      pathname: url,
      query: z.undefined(),
      body: z.undefined(),
      response: z.unknown(),
      params: RouteFactory.getParamsSchema(url),
    });
  }
}

export default new RouteFactory();
