import { RouteType } from './RouteType.js';
import { z } from 'zod';
export class RouteFactory {
  get(url) {
    return new RouteType({
      method: 'GET',
      pathname: url,
      query: z.undefined(),
      body: z.undefined(),
      response: z.unknown(),
    });
  }
  post(url) {
    return new RouteType({
      method: 'POST',
      pathname: url,
      query: z.undefined(),
      body: z.undefined(),
      response: z.unknown(),
    });
  }
  patch(url) {
    return new RouteType({
      method: 'PATCH',
      pathname: url,
      query: z.undefined(),
      body: z.undefined(),
      response: z.unknown(),
    });
  }
  delete(url) {
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
