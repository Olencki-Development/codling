import type Sinon from 'sinon';
export type GetFetchMock = <Result>(
  result?: Result,
  status?: number
) => Sinon.SinonStub<any[], Promise<Response>>;
/**
 * Generate a mock fetch
 * @param  result return result from the mocked fetch
 * @return        constructed fetch mock
 */
export declare const getFetchMock: GetFetchMock;
