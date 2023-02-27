import type { IDataCoder } from './types.js';

/**
 * A json data encoder/decoder.
 *
 * This is a provided json coder that is. See {@link IDataCoder} for specific information about the methods in this interface.
 *
 * Internally, `JSON.stringify` & `JSON.parse` are used to serialization and deserialization of request/response data.
 *
 * ### Example
 *
 * This example will set up an {@link HttpClient} with the {@link JSONDataCoder}.
 * ```ts
 * const client = new HttpClient({
 *   url: 'http://localhost:8000',
 *   coder: new JSONDataCoder()
 * })
 * ```
 */
export class JSONDataCoder implements IDataCoder {
  getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }

  encode<T = unknown>(data: T): BodyInit {
    return JSON.stringify(data);
  }

  async decode<R = unknown>(data: Blob): Promise<R> {
    const strData = await data.text();
    return JSON.parse(strData);
  }
}
