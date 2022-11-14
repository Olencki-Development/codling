# @codling/utils/promise-class
> A class that allows extension of a promise object for customization of the result

### Examples

##### Basic Example

```ts
import { PromiseClass } from '@codling/utils'

class Counter extends PromiseClass<number> {
  protected count = 0;

  add() {
    count = count + 1;
  }

  subtract() {
    count = count - 1;
  }

  protected async _fetchResult(): Promise<number> {
    return 1;
  }
}

const myCounter = new Counter();

myCounter.add().add().add() // count = 3
myCounter.subtract() // count = 2

let count = await myCounter // 2

myCounter.add().add().subtract().add()

count = await myCounter // 4
```

##### Advanced Example

```ts
import { PromiseClass } from '@codling/utils'

class Builder<T> {
  operations: T

  modify(): Builder<S> {
    return new Builder([
      ...operations,
      { mode: 'single' }
    ])
  }

  protected async _fetchResult(): Promise<T> {
    return Promise.resolve(this.operations)
  }
}

class BuildManager {
  query(): Builder<[]> {
    return new Builder([]);
  }
}
```