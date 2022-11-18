import { PromiseClass } from './index.js';

describe('@codling/utils/promise-class/PromiseClass', function () {
  class Item extends PromiseClass<number> {
    protected async _fetchResult(): Promise<number> {
      return 1;
    }

    foo() {
      return this;
    }

    bar() {
      return this;
    }
  }

  it('should allow chaining and return item on await', async function () {
    const instance = new Item();
    const result = instance.foo().bar().foo().bar().foo().bar();

    this.assert.instanceOf(result, Item);

    const awaitedResult = await result;
    this.assert.equal(awaitedResult, 1);
  });
});
