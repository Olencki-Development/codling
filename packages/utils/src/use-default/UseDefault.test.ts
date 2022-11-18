import { UseDefault } from './index.js';

describe('@codling/utils/use-default/UseDefault', function () {
  class Item {
    @UseDefault()
    foo: string | null | undefined = 'bar';
  }

  it('should set value to "bar" when new input is null', async function () {
    const instance = new Item();
    this.assert.equal(instance.foo, 'bar');

    instance.foo = null;

    this.assert.equal(instance.foo, 'bar');
  });

  it('should set value to "bar" when new input is undefined', async function () {
    const instance = new Item();
    this.assert.equal(instance.foo, 'bar');

    instance.foo = undefined;

    this.assert.equal(instance.foo, 'bar');
  });

  it('should set value when new input is not null or undefined', async function () {
    const instance = new Item();
    this.assert.equal(instance.foo, 'bar');

    instance.foo = 'apple';

    this.assert.equal(instance.foo, 'apple');
  });
});
