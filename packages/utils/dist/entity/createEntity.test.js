import { z } from 'zod';
import { createEntity } from './index.js';
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
        getFoo() {
          return this.foo;
        }
      }
      const instance = new Result({ foo: 'bar' });
      this.assert.equal(instance.getFoo(), 'bar');
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
});
