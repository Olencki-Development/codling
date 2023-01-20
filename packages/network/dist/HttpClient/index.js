import { RequestType } from './Request.js';
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
      data: {
        params: maybeOptions?.params ?? {},
        query: maybeOptions?.query,
        body: maybeOptions?.body,
      },
      statusHandlers: this._statusHandlers,
      server: this._def,
    });
  }
}
