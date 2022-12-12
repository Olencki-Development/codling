import type * as sinon from 'sinon';
/**
 * Generate a mock model for the service container
 * @param  methods array of strings that represent methods that should be mocked in order
 * @param  result  return result from the last item
 * @return         constructed complex mock
 */
export declare function complexMock(
  this: Mocha.Context,
  methods: string[],
  result?: any
): Record<string, sinon.SinonStub<any[], any>>;
