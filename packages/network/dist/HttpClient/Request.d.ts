import type { RouteTypeAny } from '../Route/route.types.js';
import type { RequestDef, RequestResult } from './request.type.js';
export declare class RequestType<R extends RouteTypeAny> {
  readonly _def: RequestDef<R>;
  constructor(_def: RequestDef<R>);
  execute(
    fetch: typeof global.fetch,
    init?: Parameters<typeof global.fetch>[1]
  ): Promise<RequestResult>;
  protected _getFormattedPathname(data: typeof this._def.data): string;
  protected _getOrigin(): string;
  protected _getQuery(data: typeof this._def.data): string | null;
  protected _getBody(data: typeof this._def.data): string | undefined;
}
