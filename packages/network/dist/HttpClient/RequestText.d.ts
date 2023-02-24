import type { RouteTypeAny } from '../Route/route.types.js';
import { type RequestResult, RequestType } from '../index.js';
import type { z } from 'zod';
export declare class RequestTextType<
  R extends RouteTypeAny
> extends RequestType<R> {
  execute<T = z.output<R['_def']['response']>>(
    fetch: typeof global.fetch,
    init?: Parameters<typeof global.fetch>[1]
  ): Promise<
    RequestResult<{
      text: T;
    }>
  >;
}
