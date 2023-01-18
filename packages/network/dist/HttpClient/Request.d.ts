import type { RouteTypeAny } from '../Route/route.types.js';
import type { RequestDef, RequestResult } from './request.type.js';
import type { z } from 'zod';
export declare class RequestType<R extends RouteTypeAny> {
  readonly _def: RequestDef<R>;
  constructor(_def: RequestDef<R>);
  execute<T = z.output<R['_def']['response']>>(
    fetch: typeof global.fetch,
    init?: Parameters<typeof global.fetch>[1]
  ): Promise<RequestResult<T>>;
  protected _getFormattedPathname(): string;
  protected _getOrigin(): string;
  protected _getQuery(): string | null;
  protected _getBody(): string | undefined;
}
