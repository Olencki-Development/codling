import { RequestType } from '../index.js';
import { handleUnknownError } from '../handleUnknownError.js';
export class RequestJSONType extends RequestType {
  async execute(fetch, init) {
    const result = await super.execute(fetch, init);
    if (!result.success) {
      return result;
    }
    try {
      const json = await result.response.json();
      return {
        ...result,
        data: this._def.route.responseSchema.parse(json),
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
