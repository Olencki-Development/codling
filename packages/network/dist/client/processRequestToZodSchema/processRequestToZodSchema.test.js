import {
  processRequestToZodSchema,
  safeProcessRequestToZodSchema,
} from './index.js';
import { z } from 'zod';
describe('@codling/network/processRequestToZodSchema', function () {
  describe('processRequestToZodSchema', function () {
    it('should throw', async function () {
      const fetch = this.mocks.fetch('Failed', 400);
      try {
        await processRequestToZodSchema(fetch(), z.number());
        throw Error('TEST FAILED');
      } catch (e) {
        this.assert.notEqual(e.message, 'TEST FAILED');
      }
    });
    it('should resolve', async function () {
      const fetch = this.mocks.fetch({ foo: 'bar' }, 200);
      try {
        const response = await processRequestToZodSchema(
          fetch(),
          z.object({ foo: z.literal('bar') })
        );
        this.assert.isOk(response);
      } catch (e) {
        this.assert.isEmpty(e);
      }
    });
  });
  describe('safeProcessRequestToJSON', function () {
    it('should not throw', async function () {
      const fetch = this.mocks.fetch('Failed', 400);
      const result = await safeProcessRequestToZodSchema(fetch(), z.number());
      this.assert.deepEqual(result, {
        success: false,
        error: new Error(
          '[http://test.local:1234/mock] failed with status [400]'
        ),
      });
    });
    it('should resolve', async function () {
      const fetch = this.mocks.fetch({ foo: 'bar' }, 200);
      const result = await safeProcessRequestToZodSchema(
        fetch(),
        z.object({ foo: z.literal('bar') })
      );
      this.assert.isTrue(result.success);
      this.assert.hasAllKeys(result, ['success', 'data']);
    });
  });
});
