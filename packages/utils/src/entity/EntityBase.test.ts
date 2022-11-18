import { z, ZodError } from 'zod';
import { EntityBase } from '.';

describe('@codling/utils/entity/EntityBase', function () {
  const schema = z.object({
    foo: z.literal('bar'),
  });
  let instance: EntityBase<typeof schema>;

  beforeEach(function () {
    instance = new EntityBase(
      {
        foo: 'bar',
      },
      schema
    );
  });

  describe('toJSON', function () {
    it('should return object of fields based on schema', function () {
      const json = instance.toJSON();
      this.assert.deepEqual(json, {
        foo: 'bar',
      });
    });
  });

  describe('toString', function () {
    it('should return a string json with default args', function () {
      const json = instance.toJSON();
      const result = instance.toString();
      this.assert.equal(result, JSON.stringify(json, undefined, 2));
    });

    it('should return a string json with custom args', function () {
      const json = instance.toJSON();
      const result = instance.toString(0);
      this.assert.equal(result, JSON.stringify(json, undefined, 0));
    });
  });

  describe('validate', function () {
    it('should return true', function () {
      // instance.foo = 'bubble' as any;
      this.assert.isTrue(instance.validate());
    });

    it('should return errors', function () {
      instance.foo = 'bubble' as any;
      this.assert.instanceOf(instance.validate(), ZodError);
    });

    it('should should throw', function () {
      instance.foo = 'bubble' as any;
      this.assert.throws(() => instance.validate(true));
    });
  });
});
