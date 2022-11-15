import { z } from 'zod';
import { createEntity, type EntityInstance } from '.';

describe('@codling/utils/entity/createEntity', function () {
  const schema = z.object({
    foo: z.literal('bar'),
  });

  it('should create instance of class', function () {
    const Result = createEntity(schema);
    const instance = new Result({ foo: 'bar' });
    this.assert.instanceOf(instance, Result);
  });

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
