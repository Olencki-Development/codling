import type { MaybePromise } from '../HttpClient/types.js';
/**
 * An interface to process data being sent and received.
 *
 * This is used in the {@link HttpClient} class to provide information about the data being sent and received. This interface also provided necessary headers for the appropriate type of data; primarily `Content-Type` and `Accept`.
 *
 * This should not be used directly. See {@link JSONDataCoder} for a json example; or provide your own.
 */
export interface IDataCoder {
  /**
   * A method used to encode data for transport.
   *
   * This is a required method that should return the body of the request. The `data` parameter is the same as what is provided to the body of a specific request.
   */
  encode<T = unknown>(data: T): MaybePromise<BodyInit>;
  /**
   * A method used to decode data from transport.
   *
   * This is a required method that should return the parsed response body of a request response. The `data` parameter is a blob of the data in the response.
   */
  decode<R = unknown>(data: Blob): MaybePromise<R>;
  /**
   * A helper method to provide any necessary headers to decribe the data.
   *
   * It is a good idea to provide `Content-Type` & `Accept` at a minimum.
   */
  getHeaders(): Record<string, string>;
}
