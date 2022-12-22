// eslint-disable @typescript-eslint/no-explicit-any
import type Sinon from 'sinon';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Readable } from 'stream';

export type GetFetchMock = <Result>(
  result?: Result,
  status?: number
) => Sinon.SinonStub<any[], Promise<Response>>;

class MockHeaders implements Headers {
  protected _headers = new Map<string, string>();

  constructor(init?: HeadersInit | null) {
    if (init) {
      if (init instanceof MockHeaders) {
        this._headers = init._headers;
      } else {
        Object.entries(init).forEach(([key, value]) => {
          this.set(key, value);
        });
      }
    }
  }

  delete(name: string): void {
    this._headers.delete(name);
  }
  get(name: string): string | null {
    return this._headers.get(name) ?? null;
  }
  has(name: string): boolean {
    return this._headers.has(name);
  }
  set(name: string, value: string): void {
    this._headers.set(name, value);
  }
  forEach(
    callbackfn: (value: string, key: string, parent: Headers) => void,
    thisArg?: any
  ): void {
    throw new Error('Method not implemented.');
  }
  entries(): IterableIterator<[string, string]> {
    return this._headers.entries();
  }
  keys(): IterableIterator<string> {
    return this._headers.keys();
  }
  values(): IterableIterator<string> {
    return this._headers.values();
  }
  [Symbol.iterator](): IterableIterator<[string, string]> {
    throw new Error('Method not implemented.');
  }
  append(name: string, value: string): void {
    this.set(name, value);
  }
}

/**
 * Generate a mock fetch
 * @param  result return result from the mocked fetch
 * @return        constructed fetch mock
 */
export const getFetchMock: GetFetchMock = function (
  this: Mocha.Context,
  result: any = {},
  status = 200
) {
  const responseString =
    typeof result === 'string' ? result : JSON.stringify(result);

  const mockedResponse: Response = {
    headers: new MockHeaders(),
    ok: status >= 200 && status <= 299,
    redirected: false,
    status,
    statusText: status.toString(),
    type: 'basic',
    url: 'http://test.local:1234/mock',
    clone: function (): Response {
      throw new Error('Function not implemented.');
    },
    body: (() => {
      const readStream = new Readable();
      readStream.push(responseString);
      readStream.push(null);
      return readStream;
    })(),
    bodyUsed: true,
    arrayBuffer: function (): Promise<ArrayBuffer> {
      throw new Error('Function not implemented.');
    },
    blob: function (): Promise<Blob> {
      throw new Error('Function not implemented.');
    },
    formData: function (): Promise<FormData> {
      throw new Error('Function not implemented.');
    },
    json: async function (): Promise<any> {
      return JSON.parse(responseString);
    },
    text: async function (): Promise<string> {
      return responseString;
    },
  };

  const fetch = this.sinon.stub().resolves(mockedResponse);

  return fetch;
};
