import type * as sinon from 'sinon';

/**
 * Generate a mock model for the service container
 * @param  methods array of strings that represent methods that should be mocked in order
 * @param  result  return result from the last item
 * @return         constructed complex mock
 */
export function complexMock(
  this: Mocha.Context,
  methods: string[],
  result: any = {} // eslint-disable-line @typescript-eslint/no-explicit-any
) {
  const item: Record<string, sinon.SinonStub> = {};

  for (let index = 0; index < methods.length; index++) {
    const method = methods[index];

    // Last item should return the result
    if (index >= methods.length - 1) {
      item[method] = this.sinon.stub().returns(result);
    } else {
      item[method] = this.sinon.stub().returns(item);
    }
  }

  return item;
}
