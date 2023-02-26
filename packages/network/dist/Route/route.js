import { RouteType } from './RouteType.js';
import { z } from 'zod';
export class RouteFactory {
  static getParamsSchema(pathname) {
    const arrayParamKeys = pathname.split('/').reduce((output, item) => {
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
    return paramSchema;
  }
  get(url) {
    return new RouteType({
      method: 'GET',
      pathname: url,
      query: z.undefined(),
      body: z.undefined(),
      response: z.unknown(),
      params: RouteFactory.getParamsSchema(url),
    });
  }
  post(url) {
    return new RouteType({
      method: 'POST',
      pathname: url,
      query: z.undefined(),
      body: z.undefined(),
      response: z.unknown(),
      params: RouteFactory.getParamsSchema(url),
    });
  }
  patch(url) {
    return new RouteType({
      method: 'PATCH',
      pathname: url,
      query: z.undefined(),
      body: z.undefined(),
      response: z.unknown(),
      params: RouteFactory.getParamsSchema(url),
    });
  }
  delete(url) {
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
