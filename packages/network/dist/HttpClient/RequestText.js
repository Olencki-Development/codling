import { RequestType } from '../index.js';
import { handleUnknownError } from '../handleUnknownError.js';
export class RequestTextType extends RequestType {
  async execute(fetch, init) {
    const result = await super.execute(fetch, init);
    if (!result.success) {
      return result;
    }
    try {
      const text = await result.response.text();
      return {
        ...result,
        text: this._def.route.responseSchema.parse(text),
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
