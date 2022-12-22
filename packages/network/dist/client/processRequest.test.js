import { processRequest, safeProcessRequest } from './processRequest.js';
describe('@codling/network/processRequest', function () {
  describe('processRequest', function () {
    it('should throw', async function () {
      const fetch = this.mocks.fetch('Failed', 400);
      try {
        await processRequest(fetch());
        throw Error('TEST FAILED');
      } catch (e) {
        this.assert.notEqual(e.message, 'TEST FAILED');
      }
    });
    it('should resolve', async function () {
      const fetch = this.mocks.fetch({}, 200);
      try {
        const response = await processRequest(fetch());
        this.assert.isOk(response);
      } catch (e) {
        this.assert.isEmpty(e);
      }
    });
  });
  describe('safeProcessRequest', function () {
    it('should not throw', async function () {
      const fetch = this.mocks.fetch('Failed', 400);
      const result = await safeProcessRequest(fetch());
      this.assert.deepEqual(result, {
        success: false,
        error: new Error(
          '[http://test.local:1234/mock] failed with status [400]'
        ),
      });
    });
    it('should resolve', async function () {
      const fetch = this.mocks.fetch({}, 200);
      const result = await safeProcessRequest(fetch());
      this.assert.isTrue(result.success);
      this.assert.hasAllKeys(result, ['success', 'data']);
    });
  });
});
