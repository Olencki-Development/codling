/**
 * Generate a mock model for the service container
 * @param  methods array of strings that represent methods that should be mocked in order
 * @param  result  return result from the last item
 * @return         constructed complex mock
 */
export const getComplexMock = function (methods, result) {
  return methods.reduce((output, methodName, index, array) => {
    if (index >= array.length - 1) {
      output[methodName] = this.sinon.stub().returns(result);
    } else {
      output[methodName] = this.sinon.stub().returns(output);
    }
    return output;
  }, {});
};
