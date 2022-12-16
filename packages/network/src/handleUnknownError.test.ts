import { handleUnknownError } from './handleUnknownError.js';

describe('@codling/network/handleUnknownError', function () {
  it('should return error when error provided', function () {
    const input = new Error('Test');
    const result = handleUnknownError(input);
    this.assert.instanceOf(result, Error);
    this.assert.equal(result, input);
  });

  it('should return error when object with toString method provided', function () {
    const input = {
      toString: this.sinon.stub().returns('Test'),
    };
    const result = handleUnknownError(input);
    this.assert.instanceOf(result, Error);
    this.assert.equal(result.message, 'Test');
  });

  it('should return error when string provided', function () {
    const input = 'Test';
    const result = handleUnknownError(input);
    this.assert.instanceOf(result, Error);
    this.assert.equal(result.message, 'Test');
  });

  it('should return error when unknown item provided', function () {
    const input = undefined;
    const result = handleUnknownError(input);
    this.assert.instanceOf(result, Error);
    this.assert.equal(result.message, 'Unknown error has occured.');
  });
});
