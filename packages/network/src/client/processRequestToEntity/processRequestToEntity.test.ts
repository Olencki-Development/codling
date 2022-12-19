import { processRequestToEntity, safeProcessRequestToEntity } from './index.js';
import { z } from 'zod';
import { createEntity } from '@codling/utils';

describe('@codling/network/processRequestToEntity', function () {
  const TestSchema = z.object({
    foo: z.string().min(0),
  });
  class TestEntity extends createEntity(TestSchema) {}

  describe('processRequestToEntity', function () {
    it('should throw', async function () {
      const fetch = this.mocks.fetch('Failed', 400);
      try {
        await processRequestToEntity(fetch(), TestEntity);
        throw Error('TEST FAILED');
      } catch (e) {
        this.assert.notEqual((e as Error).message, 'TEST FAILED');
      }
    });

    it('should resolve', async function () {
      const fetch = this.mocks.fetch({ foo: 'bar' }, 200);
      try {
        const response = await processRequestToEntity(fetch(), TestEntity);
        this.assert.isOk(response);
        this.assert.instanceOf(response, TestEntity);
      } catch (e) {
        this.assert.isEmpty(e);
      }
    });
  });

  describe('safeProcessRequestToEntity', function () {
    it('should not throw', async function () {
      const fetch = this.mocks.fetch('Failed', 400);
      const result = await safeProcessRequestToEntity(fetch(), TestEntity);
      this.assert.deepEqual(result, {
        success: false,
        error: new Error('[undefined] failed with status [400]'),
      });
    });

    it('should resolve', async function () {
      const fetch = this.mocks.fetch({ foo: 'bar' }, 200);
      const result = await safeProcessRequestToEntity(fetch(), TestEntity);
      this.assert.isTrue(result.success);
      this.assert.hasAllKeys(result, ['success', 'data']);
    });

    it('should resolve without validation', async function () {
      const fetch = this.mocks.fetch({ foo: 'bar' }, 200);
      const result = await safeProcessRequestToEntity(fetch(), TestEntity, {
        validateEntity: false,
      });
      this.assert.isTrue(result.success);
      this.assert.hasAllKeys(result, ['success', 'data']);
    });
  });
});
