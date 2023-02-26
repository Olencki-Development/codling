import type { z } from 'zod';
import type { RouteTypeAny } from '../Route/route.types.js';
import type {
  InferRequestData,
  RequestDef,
  RequestResult,
} from './request.type.js';
import { HttpClient } from '../index.js';
export declare class RequestType<
  T_Route extends RouteTypeAny,
  T_Client extends HttpClient
> {
  readonly _def: RequestDef<T_Route, T_Client>;
  constructor(_def: RequestDef<T_Route, T_Client>);
  getData(): InferRequestData<T_Route>;
  getUrl(): URL;
  execute(
    fetch: typeof global.fetch,
    init?: Parameters<typeof global.fetch>[1]
  ): Promise<
    RequestResult<{
      data: z.infer<T_Route['responseSchema']>;
    }>
  >;
  protected _getFormattedPathname(data: InferRequestData<T_Route>): string;
}
