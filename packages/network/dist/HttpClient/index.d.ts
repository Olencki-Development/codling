import type {
  HttpClientDef,
  HttpClientRequestArgs,
  StatusHandlerFunc,
} from './types.js';
import type { RouteTypeAny } from '../Route/route.types.js';
import { RequestType } from './Request.js';
import type { IDataCoder } from '../DataCoder/types.js';
export declare class HttpClient<T_Coder extends IDataCoder = IDataCoder> {
  readonly _def: HttpClientDef<T_Coder>;
  readonly _statusHandlers: Map<number, StatusHandlerFunc<any>>;
  constructor(_def: HttpClientDef<T_Coder>);
  onStatus<T extends Error | undefined | void = void>(
    status: number,
    handler: StatusHandlerFunc<T>
  ): this;
  request<R extends RouteTypeAny>(
    route: R,
    ...[maybeOptions]: HttpClientRequestArgs<R, this>
  ): RequestType<R, this>;
}
