export class RouteType {
  constructor(_def) {
    this._def = _def;
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
  expectJSON(response) {
    return new RouteType({
      ...this._def,
      response,
    });
  }
}
