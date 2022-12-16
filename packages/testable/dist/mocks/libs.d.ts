/**
 * Generate a mock fetch for use with the service container
 * @param  result return result from the mocked fetch
 * @return        constructed fetch mock
 */
export declare function fetchMock(
  this: Mocha.Context,
  result?: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  status?: number
): import('sinon').SinonStub<any[], any>;
