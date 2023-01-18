import { RequestType } from './Request.js';
import { z } from 'zod';
export class HttpClient {
  constructor(_def) {
    this._def = _def;
    this._statusHandlers = new Map();
  }
  onStatus(status, handler) {
    this._statusHandlers.set(status, handler);
    return this;
  }
  request(route, ...[maybeOptions]) {
    return new RequestType({
      route: route._def,
      data: z
        .object({
          params: this._getParamSchema(route),
          query: route._def.query,
          body: route._def.body,
        })
        .parse({
          params: maybeOptions?.params ?? {},
          query: maybeOptions?.query,
          body: maybeOptions?.body,
        }),
      statusHandlers: this._statusHandlers,
      server: this._def,
    });
  }
  _getParamSchema(route) {
    const pathname = route._def.pathname;
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
}
