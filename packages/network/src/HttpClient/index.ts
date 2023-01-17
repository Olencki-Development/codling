import type {
  HttpClientDef,
  HttpClientRequestArgs,
  StatusHandlerFunc,
} from './types.js';
import type { RouteType } from '../Route/RouteType.js';
import type {
  RouteBody,
  RouteMethod,
  RouteQuery,
} from '../Route/route.types.js';
import type { Pathname } from '../Route/pathname.types.js';

export class HttpClient {
  readonly _statusHandlers = new Map<number, StatusHandlerFunc<any>>();

  constructor(readonly _def: HttpClientDef) {}

  onStatus<T = void>(status: number, handler: StatusHandlerFunc<T>) {
    this._statusHandlers.set(status, handler);
    return this;
  }

  request<
    M extends RouteMethod,
    P extends Pathname,
    Q extends RouteQuery,
    B extends RouteBody
  >(
    route: RouteType<M, P, Q, B>,
    ...[maybeOptions]: HttpClientRequestArgs<RouteType<M, P, Q, B>>
  ) {
    // no-opt
  }
}
