import { CodlingNetworkError } from './NetworkError.js';
describe('@codling/network/errors/NetworkError', function () {
  it('should create instance with properties', function () {
    const instance = new CodlingNetworkError('My message', {
      foo: 'bar',
    });
    this.assert.containsAllKeys(instance, ['response']);
    this.assert.equal(instance.message, 'My message');
    this.assert.instanceOf(instance, Error);
    this.assert.instanceOf(instance, CodlingNetworkError);
  });
});
