import { z } from 'zod';
import { createEntity, type EntityInstance } from '.';

describe('@codling/utils/entity/createEntity', function () {
  const schema = z.object({
    foo: z.literal('bar'),
  });

  it('should create class with static properties', function () {
    const Result = createEntity(schema);
    this.assert.property(Result, 'from');
  });

  it('should create instance of class', function () {
    const Result = createEntity(schema);
    const instance = new Result({ foo: 'bar' });
    // const instance = Result.from({ foo: 'bar' });
    this.assert.instanceOf(instance, Result);
  });

  // it('should create multiple instance of class', function () {
  //   const Result = createEntity(schema);
  //   const instance = Result.from([{ foo: 'bar' }, { foo: 'bar' }]);
  //   this.assert.isArray(instance);
  //   this.assert.lengthOf(instance, 2);
  //   this.assert.instanceOf(instance[0], Result);
  // });

  it('should allow custom methods and subclassing', function () {
    const Item = createEntity(schema);
    class Result extends Item {
      getFoo(this: EntityInstance<typeof schema>) {
        return this.foo;
      }
    }

    const instance = new Result({ foo: 'bar' });
    this.assert.equal(instance.getFoo(), 'bar');
  });
});
