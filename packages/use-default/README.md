# @utils/use-default
> Value manipulate for properties on a class to provide defaults when the property is set to null or undefined at runtime

### Examples

##### Basic Example

```
class MyTest {
  @UseDefault()
  foo: string | null | undefined = 'bar'
}

const instance = new MyTest()
instance.foo // bar

instance.foo = null
instance.foo // bar

instance.foo = undefined
instance.foo // bar

instance.foo = 'hello world'
instance.foo // hello world
```

##### Advanced Example

```
class MyTest {
  @UseDefault({ whenNull: true })
  foo: string | null | undefined = 'bar'
}

const instance = new MyTest()
instance.foo // bar

instance.foo = null
instance.foo // bar

instance.foo = undefined
instance.foo // undefined

instance.foo = 'hello world'
instance.foo // hello world
```