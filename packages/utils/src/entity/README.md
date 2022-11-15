# @codling/utils/entity
> A data management package for easily validating, attaching items to and modifying data

### Examples

##### Basic Example

```ts
import { createEntity } from '@codling/utils'
import { z } from 'zod'

const IUser = z.object({
  name: z.object({
    first: z.string(),
    last: z.string()
  }),
  age: z.number().default(null).nullish().optional()
})

const User = createEntity(IUser)

const myUser = new User({
  name: {
    first: 'John',
    last: 'Smith'
  }
})

// myUser.name.first - 'John'
// myUser.name.last - 'Smith'
// myUser.age - null

myUser.toJSON()
/**
  {
    "name": {
      "first": "John",
      "last": "Smith"
    },
    "age": null
  }
 */
```

##### Advanced Example

```ts
import { createEntity } from '@codling/utils'
import { z } from 'zod'

const IUser = z.object({
  name: z.object({
    first: z.string(),
    last: z.string()
  }),
  age: z.number().default(null).nullish().optional()
})

class User extends createEntity(IUser) {
  fullName() {
    return [this.name.first, this.name.last].join(' ')
  }
}

const myUser = new User({
  name: {
    first: 'John',
    last: 'Smith'
  }
})

// myUser.name.first - 'John'
// myUser.name.last - 'Smith'
// myUser.age - null
// myUser.fullName() - 'John Smith'

myUser.toJSON()
/**
  {
    "name": {
      "first": "John",
      "last": "Smith"
    },
    "age": null
  }
 */
```
