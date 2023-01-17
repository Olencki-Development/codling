import { processRequestToJSON, safeProcessRequestToJSON } from './index.js';

describe('@codling/network/processRequestToJSON', function () {
  describe('processRequestToJSON', function () {
    it('should throw', async function () {
      const fetch = this.mocks.fetch('Failed', 400);
      try {
        await processRequestToJSON(fetch());
        throw Error('TEST FAILED');
      } catch (e) {
        this.assert.notEqual((e as Error).message, 'TEST FAILED');
      }
    });

    it('should resolve', async function () {
      const fetch = this.mocks.fetch({ foo: 'bar' }, 200);
      try {
        const response = await processRequestToJSON(fetch());
        this.assert.isOk(response);
      } catch (e) {
        this.assert.isEmpty(e);
      }
    });
  });

  describe('safeProcessRequestToJSON', function () {
    it('should not throw', async function () {
      const fetch = this.mocks.fetch('Failed', 400);
      const result = await safeProcessRequestToJSON(fetch());
      this.assert.deepEqual(result, {
        success: false,
        error: new Error(
          '[http://test.local:1234/mock] failed with status [400]'
        ),
      });
    });

    it('should resolve', async function () {
      const fetch = this.mocks.fetch({ foo: 'bar' }, 200);
      const result = await safeProcessRequestToJSON(fetch());
      this.assert.isTrue(result.success);
      this.assert.hasAllKeys(result, ['success', 'data']);
    });
  });
});
