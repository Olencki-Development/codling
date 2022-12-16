import * as entity from './index.js';
describe('@codling/utils/entity', function () {
  it('should match exports', function () {
    this.assert.hasAllKeys(entity, ['createEntity']);
  });
});
