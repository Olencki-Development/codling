import { z } from 'zod';
export class RouteType {
  constructor(_def) {
    this._def = _def;
  }
  get method() {
    return this._def.method;
  }
  get pathname() {
    return this._def.pathname;
  }
  get paramSchema() {
    const pathname = this._def.pathname;
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
  get responseSchema() {
    return this._def.response;
  }
  get querySchema() {
    return this._def.query;
  }
  get bodySchema() {
    return this._def.body;
  }
  query(query) {
    return new RouteType({
      ...this._def,
      query,
    });
  }
  body(body) {
    if (['GET', 'HEAD'].includes(this._def.method.toUpperCase())) {
      throw new Error('Request with GET/HEAD method cannot have body.');
    }
    return new RouteType({
      ...this._def,
      body,
    });
  }
  response(response) {
    return new RouteType({
      ...this._def,
      response,
    });
  }
}
