import type { MaybePromise } from '../HttpClient/types.js';
export interface IDataCoder {
  encode<T = unknown>(data: T): MaybePromise<BodyInit>;
  decode<R = unknown>(data: Blob): MaybePromise<R>;
  getHeaders(): Record<string, string>;
}
