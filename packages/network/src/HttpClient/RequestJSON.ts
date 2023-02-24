import type { RouteTypeAny } from '../Route/route.types.js';
import { type RequestResult, RequestType } from '../index.js';
import type { z } from 'zod';
import { handleUnknownError } from '../handleUnknownError.js';

export class RequestJSONType<R extends RouteTypeAny> extends RequestType<R> {
  async execute<T = z.output<R['_def']['response']>>(
    fetch: typeof global.fetch,
    init?: Parameters<typeof global.fetch>[1]
  ): Promise<RequestResult<{ data: T }>> {
    const result = await super.execute(fetch, init);
    if (!result.success) {
      return result;
    }

    try {
      const json = await result.response.json();
      return {
        ...result,
        data: this._def.route.responseSchema.parse(json) as T,
      };
    } catch (e) {
      return {
        success: false,
        error: handleUnknownError(e),
        response: result.response,
      };
    }
  }
}
