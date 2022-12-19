# @codling/network
> A client network tool for handling fetch responses and error parsing.

### Examples

##### Basic Example

```
import { processRequestToJSON } from '@codling/network'

type User = {
  name: string;
  age: number;
}

const request = fetch('/users')
const json = processRequestToJSON<User[]>(request);

```