import type { IDataCoder } from './types.js';

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
