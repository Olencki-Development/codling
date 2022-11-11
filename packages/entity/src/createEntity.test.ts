import { z } from 'zod';
import { createEntity } from './';

describe('@utils/entity/createEntity', function () {
  const schema = z.object({
    foo: z.literal('bar'),
  });

  it('should create class with static properties', function () {
    const Result = createEntity(schema);
    this.assert.property(Result, 'from');
  });

  it('should create instance of class', function () {
    const Result = createEntity(schema);
    const instance = Result.from({ foo: 'bar' });
    this.assert.instanceOf(instance, Result);
  });
});
