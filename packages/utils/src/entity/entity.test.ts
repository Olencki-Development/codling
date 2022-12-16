import * as entity from './index.js';
import { z } from 'zod';

describe('@codling/utils/entity', function () {
  it('should match exports', function () {
    this.assert.hasAllKeys(entity, ['createEntity']);
  });

  describe('functional example', function () {
    const User = z.object({
      name: z.object({
        first: z.string().min(1),
        last: z.string().min(1),
      }),
      age: z
        .number()
        .nullish()
        .transform((n) => {
          if (typeof n === 'number') {
            return n;
          }
          return null;
        })
        .pipe(z.number().finite().gte(0).nullable()),
    });

    class UserModel extends entity.createEntity(User) {
      fullName() {
        return [this.name.first, this.name.last].join(' ');
      }
    }

    it('should resolve with initial json', function () {
      const instance = new UserModel({
        name: {
          first: 'John',
          last: 'Smith',
        },
        age: undefined,
      });
      instance.validate();
      this.assert.equal(instance.fullName(), 'John Smith');
      this.assert.deepEqual(instance.toJSON(), {
        name: {
          first: 'John',
          last: 'Smith',
        },
        age: null,
      });
    });

    it('should resolve with empty initial json', function () {
      const instance = new UserModel();
      instance.name = {
        first: 'John',
        last: 'Smith',
      };
      instance.age = 18;
      instance.validate();
      this.assert.equal(instance.fullName(), 'John Smith');
      this.assert.deepEqual(instance.toJSON(), {
        name: {
          first: 'John',
          last: 'Smith',
        },
        age: 18,
      });
    });
  });
});
