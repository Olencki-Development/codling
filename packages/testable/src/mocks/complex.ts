import type * as sinon from 'sinon';

type LastIndexOfArray<Arr extends readonly any[]> = Arr extends readonly [
  any,
  ...infer Other
]
  ? Other['length']
  : 0;
type ComplexMock<Arr extends readonly any[], Result = any> = {
  [P in keyof Arr as Arr[P] extends Arr[number]
    ? Arr[P]
    : never]: P extends LastIndexOfArray<Arr>
    ? sinon.SinonStub<any[], Result>
    : sinon.SinonStub<any[], ComplexMock<Arr, Result>>;
};

export type GetComplexMock = <Methods extends readonly string[], Result = any>(
  methods: Methods,
  result?: Result
) => ComplexMock<Methods, Result>;

/**
 * Generate a mock model for the service container
 * @param  methods array of strings that represent methods that should be mocked in order
 * @param  result  return result from the last item
 * @return         constructed complex mock
 */
export const getComplexMock: GetComplexMock = function <
  Methods extends readonly string[],
  Result = any
>(this: Mocha.Context, methods: Methods, result?: Result) {
  return methods.reduce(
    (output: Record<string, sinon.SinonStub>, methodName, index, array) => {
      if (index >= array.length - 1) {
        output[methodName] = this.sinon.stub().returns(result);
      } else {
        output[methodName] = this.sinon.stub().returns(output);
      }
      return output;
    },
    {}
  ) as ComplexMock<Methods, Result>;
};
