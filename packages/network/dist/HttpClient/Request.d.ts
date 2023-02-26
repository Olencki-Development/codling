import type { z } from 'zod';
import type { RouteTypeAny } from '../Route/route.types.js';
import type {
  InferRequestData,
  RequestDef,
  RequestResult,
} from './request.type.js';
export declare class RequestType<R extends RouteTypeAny> {
  readonly _def: RequestDef<R>;
  constructor(_def: RequestDef<R>);
  getData(): InferRequestData<R>;
  getUrl(): URL;
  execute(
    fetch: typeof global.fetch,
    init?: Parameters<typeof global.fetch>[1]
  ): Promise<
    RequestResult<{
      data: z.infer<R['responseSchema']>;
    }>
  >;
  protected _getFormattedPathname(data: InferRequestData<R>): string;
  protected _getBody(headers: HeadersInit): any;
  protected _fetchResponseData(
    response: Response,
    requestHeaders: HeadersInit
  ): Promise<any>;
  protected _getHeader(headers: HeadersInit, headerName: string): string | null;
}
