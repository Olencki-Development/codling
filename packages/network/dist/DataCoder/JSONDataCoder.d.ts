import type { IDataCoder } from './types.js';
export declare class JSONDataCoder implements IDataCoder {
  getHeaders(): Record<string, string>;
  encode<T = unknown>(data: T): BodyInit;
  decode<R = unknown>(data: Blob): Promise<R>;
}
