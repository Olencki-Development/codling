var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function')
      return Reflect.metadata(k, v);
  };
import { UseDefault } from './index.js';
describe('@codling/utils/use-default/UseDefault', function () {
  class Item {
    constructor() {
      this.foo = 'bar';
    }
  }
  __decorate(
    [UseDefault(), __metadata('design:type', Object)],
    Item.prototype,
    'foo',
    void 0
  );
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
