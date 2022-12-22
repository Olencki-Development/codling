// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Readable } from 'stream';
class MockHeaders {
  constructor(init) {
    this._headers = new Map();
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
  delete(name) {
    this._headers.delete(name);
  }
  get(name) {
    return this._headers.get(name) ?? null;
  }
  has(name) {
    return this._headers.has(name);
  }
  set(name, value) {
    this._headers.set(name, value);
  }
  forEach(callbackfn, thisArg) {
    throw new Error('Method not implemented.');
  }
  entries() {
    return this._headers.entries();
  }
  keys() {
    return this._headers.keys();
  }
  values() {
    return this._headers.values();
  }
  [Symbol.iterator]() {
    throw new Error('Method not implemented.');
  }
  append(name, value) {
    this.set(name, value);
  }
}
/**
 * Generate a mock fetch
 * @param  result return result from the mocked fetch
 * @return        constructed fetch mock
 */
export const getFetchMock = function (result = {}, status = 200) {
  const responseString =
    typeof result === 'string' ? result : JSON.stringify(result);
  const mockedResponse = {
    headers: new MockHeaders(),
    ok: status >= 200 && status <= 299,
    redirected: false,
    status,
    statusText: status.toString(),
    type: 'basic',
    url: 'http://test.local:1234/mock',
    clone: function () {
      throw new Error('Function not implemented.');
    },
    body: (() => {
      const readStream = new Readable();
      readStream.push(responseString);
      readStream.push(null);
      return readStream;
    })(),
    bodyUsed: true,
    arrayBuffer: function () {
      throw new Error('Function not implemented.');
    },
    blob: function () {
      throw new Error('Function not implemented.');
    },
    formData: function () {
      throw new Error('Function not implemented.');
    },
    json: async function () {
      return JSON.parse(responseString);
    },
    text: async function () {
      return responseString;
    },
  };
  const fetch = this.sinon.stub().resolves(mockedResponse);
  return fetch;
};
