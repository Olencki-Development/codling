import { z } from 'zod';
import { createEntity, type Entity } from './index.js';

describe('@codling/utils/entity/createEntity', function () {
  describe('input output same', function () {
    const schema = z.object({
      foo: z.literal('bar'),
    });

    it('should create instance of class', function () {
      const Result = createEntity(schema);
      const instance = new Result({ foo: 'bar' });
      this.assert.instanceOf(instance, Result);
    });

    it('should create empty instance of class', function () {
      const Result = createEntity(schema);
      const instance = new Result();
      this.assert.instanceOf(instance, Result);
    });

    it('should allow custom methods and subclassing', function () {
      const Item = createEntity(schema);
      class Result extends Item {
        getFoo(this: Entity<typeof schema>) {
          return this.foo;
        }
      }

      const instance = new Result({ foo: 'bar' });
      this.assert.equal(instance.getFoo(), 'bar');
    });

    describe('clone with inheritance', function () {
      it('should return new instance with custom methods', function () {
        const Item = createEntity(schema);
        class Result extends Item {
          getFoo(this: Entity<typeof schema>) {
            return this.foo;
          }
        }

        const instance = new Result({
          foo: 'bar',
        });
        const instance2 = instance.clone();
        this.assert.instanceOf(instance2, Result);
        this.assert.notEqual(instance, instance2);
      });
    });
  });

  describe('input output ZodIntersect', function () {
    const baseSchema = z.object({
      foo: z.string(),
      count: z.number(),
      id: z.number(),
    });
    const schema = baseSchema
      .pick({
        id: true,
      })
      .and(
        baseSchema
          .omit({
            foo: true,
          })
          .deepPartial()
      );

    it('should create instance of class', function () {
      const Result = createEntity(schema);
      const instance = new Result({ id: 4, count: 4 });
      this.assert.instanceOf(instance, Result);
    });
  });

  describe('input output different', function () {
    const schema = z.object({
      count: z.preprocess((value) => {
        if (typeof value === 'string') {
          return parseInt(value);
        }
        return value;
      }, z.number()),
      name: z.string().transform((value) => {
        if (value.includes(' ')) {
          const [first, last] = value.split(' ');
          return {
            first,
            last,
          };
        }

        return value;
      }),
    });

    it('should create instance of class', function () {
      const Result = createEntity(schema);
      const instance = new Result({ count: '4', name: 'John smith' });
      instance.validate();
      this.assert.isNumber(instance.count);
      this.assert.hasAllKeys(instance.name, ['first', 'last']);
      this.assert.instanceOf(instance, Result);
    });

    it('should create empty instance of class', function () {
      const Result = createEntity(schema);
      const instance = new Result();
      this.assert.isUndefined(instance.count);
      this.assert.instanceOf(instance, Result);
    });
  });

  describe('input output custom input', function () {
    const schema = z.object({
      count: z.number().default(0),
      name: z.string(),
    });

    it('should create instance of class', function () {
      const Result = createEntity<typeof schema, { foo: 'bar' }>(schema);
      const instance = new Result({ foo: 'bar' });
      this.assert.isUndefined(instance.count);
      this.assert.isUndefined(instance.name);
      this.assert.deepEqual(instance.initialValues, { foo: 'bar' });
      this.assert.instanceOf(instance, Result);
    });

    it('should create empty instance of class', function () {
      const Result = createEntity(schema);
      const instance = new Result();
      this.assert.isUndefined(instance.count);
      this.assert.instanceOf(instance, Result);
    });
  });
});
