# [@codling/network](https://www.npmjs.com/package/@codling/network)

@codling/network is a type-safe and autocompletion-friendly typescript networking tool.

![](https://github.com/Olencki-Development/codling/blob/main/packages/network/assets/demo.gif)

@codling/network makes sure you know what data your sending and receiving at every level. On the client, requests only allow you to send and receive data that has been validated. On the server, data is sanitized before you can access it. Pre-defined routes act as a data contract so you know what is being processes every step of the way.

As shown in the gif above, through the pure magic of modern typescript, @codling/network is even able to parse
the params from the pathname of a url to validate you're sending the correct data. @codling/network is able to ensure url params, query values, body payloads, and responses of all different data structures.

Of course, there are many types of data that can be sent and received over http(s). @codling/network provides a json data encoder/decoder but allows custom ones to be written and used.

All API documentation is written in the typing files and you can simply `cmd-click` on the module, class
or method you're using to see it.

If you start using @codling/network and can't find something you'd want to use, please open an issue.

You can find a more thorough examples [here](https://github.com/Olencki-Development/codling/tree/main/packages/network/examples).

# Table of contents

- [Installation](#installation)
- [Minimal example](#minimal-example)
- [Defining requests](#defining-requests)
  - [Request types](#request-types)
  - [URL params](#url-params)
  - [Query strings](#query-strings)
  - [Body data](#body-data)
- [Http clients](#http-clients)
  - [Data parsing](#data-parsing)
  - [Providing data](#providing-data)
  - [Execution](#execution)
  - [Error handling](#error-handling)
  - [Status code handlers](#status-code-handlers)
  - [Headers](#headers)
- [Http servers](#http-servers)
  - [Route implementation handlers](#route-implementation-handlers)

# Installation

@codling/network currently works on the client with minimal server support. It uses [Zod](https://www.npmjs.com/package/zod) under the hood to validate data. You can install it using:

```
npm install @codling/network zod
```

The intent is to expand server support in the future. Right now, @codling/network offers great support for client requests and server request handlers.

## A quick word from the author

@codling/network was inspired to keep a data contract and typescript types aligned between a backend and frontend project. Recently, I've been seeing and writing more projects in a monorepo structure. This usually means I have an API/backend and a frontend project living inside a top level root project using something like [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) or another alternative. When doing this, I found it a challenge to locate and keep entities aligned as the API grew and matured. By defining route contracts in a utility package, I was able to import them into the backend for implementation logic and access them in the frontend for execution. The main benefit over something like [tRPC](https://github.com/trpc/trpc) or [graphql](https://graphql.org/) is @codling/network follows a RESTful approach by design, allowing multiple endpoints for specific funtionality.

I've provided an minimal folder structure to help communicate the benefits:

```
- root projct
  - packages
    - entities // a utility package that describes routes
    - backend // a backend api that imports entities to handle implementation details
    - frontend // a frontend that imports entities to execute typed requests to the backend
```


# Minimal example

All you need to do is define your routes for the server. These routes are then used on the client to execute requests. On the server, functions can be generated to validate input and output data. This package was designed with monorepos in mind that offer a nodejs server and client. It also offers a powerful networking tool that can be used on it's own.

```ts
import { z } from 'zod'
import {
  route
} from '@codling/network'

/**
 * routes.ts
 * 
 * A file of folder that contains route definitions.
 **/

const findUserById = route
  .get('/users/:userId')
  .response(z.object({
    id: z.number(),
    name: z.string().trim().min(1),
    email: z.string().trim().email()
  }))

const createPost = route
  .post('/posts')
  .body(z.object({
    title: z.string().trim().min(1),
    body: z.string().trim().min(1)
  }))
  .response(z.object({
    id: z.number(),
    title: z.string().trim().min(1),
    body: z.string().trim().min(1)
  }))

const findPostsByUserId = route
  .get('/users/:userId/posts')
  .query(z.object({
    order: z.literal('asc').or(z.literal('desc'))
  }))
  .response(
    z.array(
      z.object({
        id: z.number(),
        title: z.string().trim().min(1),
        body: z.string().trim().min(1)
      })
    )
  )

/**
 * client/networker.ts
 * 
 * A file or folder that is a client side networker. 
 **/
import { HttpClient, JSONDataCoder } from '@codling/network'

const client = new HttpClient({
  url: 'http://localhost:8000',
  coder: new JSONDataCoder()
})

async function demo() {
  const user = await client
    .request(findUserById, {
      params: {
        userId: '1'
      }
    })
    .execute(fetch)

  const newPost = await client
    .request(createPost, {
      body: {
        title: 'My Title',
        body: 'This is my body'
      }
    })
    .execute(fetch)

  if (user.success) {
    const allPosts = await client
      .request(findPostsByUserId, {
        params: {
          userId: user.data.id.toString()
        },
        body: {
          title: 'My Title',
          body: 'This is my body'
        }
      })
      .execute(fetch)
  }
}
```

# Defining requests

## Request types

@codling/network supports `GET`, `POST`, `DELETE` & `PATCH` requests. These requests can contain url params, query strings, & body payloads. The `GET` request method can not accept a request body.

```ts
import { route } from '@codling/network'

// create a GET request
route.get('/users')

// create a POST request
route.post('/users')

// create a DELETE request
route.delete('/users')

// create a PATCH request
route.patch('/users')
```

## URL params

Url params are dynamically extracted from the pathname the route is initialized with. A param should be indicated with the `:` character.

Example:
```ts
route.get('/users/:userId')
// yields the params { userId: string }
```

By default, the validation schema that is generated requires params to be of type string; validated with `ZodString`. This can be overwriten on a route by providing a custom schema. The keys are dynamically provided with the power of typescript.

```ts
route.get('/users/:userId').params(z.object({
  userId: z.coerce.number()
}))
```

## Query strings

To provide a query schema, pass an instance of `ZodObject` to the method below. These values are then expected and encoded when executing the request.

```ts
route.get('/users').query(z.object({
  sort: z.enum(['desc', 'asc']).optional()
}))
```

## Body data

A payload can be sent as part of the request by providing a body schema. Any `ZodType` instance can be provided to the method. @codling/network provides a JSON data encoder/decoder but a custom one can be used as well. See [Data parsing](#data-parsing) for more information on custom data parsers. 

```ts
route.get('/users').body(z.object({
  name: z.string()
}))
```

# Http clients

An `HttpClient` is a way to identify a server and execute requests to specific routes. Once you have routes defined, an instance of `HttpClient` can be created that points to a specific url. The client also handles a specific data type. By default, @codling/network provides some data decoding/encoding options. See [Data parsing](#data-parsing) for more information.

```ts
import { HttpClient, JSONDataCoder } from '@codling/network'

const client = new HttpClient({
  url: 'http://localhost:8000',
  coder: new JSONDataCoder()
})
```

The expected route params, query string, and body data are infered by typescript and validated upon execution using the provided zod schemas.


## Data parsing

When a request is executed, data found in the request & response body is usually encoded in some way. One common way is JSON. By default, `@codling/network provides these data encoders:

### JSONDataCoder

The purpose of this coder is to encode request data to JSON, decode data to JSON, and provide headers for the requests.

### IDataEncoder

An interface that all coders must adhere to. This exposes methods for encoding and decoding data; along with providing headers to the request. 

To create your own coder class, supply functionality to these methods.

```ts
import { IDataCoder } from '@codling/network'

class MyDataCoder implements IDataCoder {
  getHeaders(): Record<string, string> {
    // Return any headers you'll need. Commonly, Content-Type & Accept are populated.
    return {};
  }

  encode<T = unknown>(data: T): BodyInit {
    // FIX: implement data encoding. The T is the type of data that was provided in the request execution. 
  }

  async decode<R = unknown>(data: Blob): Promise<R> {
    // FIX: implement data dencoding. The R is whatever expected response type
  }
}
```


## Providing data

The expected data values are interpreted by typescript from the provided ZodSchema's when creating your routes. When attempting to execute the route, if there is no expected data, none will be asked for.

Example with a url param and query.
```ts
const req = route
  .get('/users/:userId')
  .query(z.object({
    sort: z.literal('desc')
  }))
  .response(z.object({
    id: z.number(),
    name: z.string()
  }))

const client = new HttpClient({
  url: 'http://localhost:8000',
  coder: new JSONDataCoder()
})

const result = await client
  .request(req, {
    params: {
      userId: '1'
    },
    query: {
      sort: 'desc'
    }
  })
```

Example with a no data types.
```ts
const req = route
  .get('/users')
  .response(z.object({
    id: z.number(),
    name: z.string()
  }))

const client = new HttpClient({
  url: 'http://localhost:8000',
  coder: new JSONDataCoder()
})

const result = await client
  .request(req)
```

## Execution

To execute the request, provide an instance of `fetch` or `node-fetch`. If an error takes place, an instance of `CodlingNetworkError` is returned along with the underlying issue. 

```ts
const result = await client
  .request(req).execute(fetch)
```

## Error handling

If an error takes place during execution of a request, an instance of `CodlingNetworkError` is returned along with the underlying issue. You have access to the response instance as well.

## Status code handlers

To handle certain status codes on a `HttpClient` instance global level, handlers can be registered to a certain number. This can be helpful to remove user tokens or handle other specific logic.

```ts
const client = new HttpClient({
  url: 'http://localhost:8000',
  coder: new JSONDataCoder()
})
.onStatus(403, (response) => {
  // perform logic here
})
```

## Headers

Headers can be provided in a few different areas. They are then merged together upon execution of the request. First they are derived from the `IDataCoder` instance. These are then merged with any provided to the `HttpClient` instance. Lastly, headers can be attached at the `.execute` level.

# Http servers

There is more to be done here but for the time being implemementation handlers can be created for routes. 

## Route implementation handlers
These will validate incoming url params, query strings, and body data. The returned value will be validated before accessible outside the function.

```ts
const req = route
  .post('/users/:userId')
  .query(z.object({
    populate: z.boolean()
  }))
  .body(z.object({
    name: z.string()
  }))
  .respones(z.object({
    id: z.number()
  }))

const handler = req.implement((options) => {
  options.params.userId // number
  options.query.populate // boolean
  options.body.name // string

  return {
    id: 1
  }
})

handler // typeof 'function'
handler.route // the req defined above
```

# How to contribute to @codling/network

See [CONTRIBUTING.md](./CONTRIBUTING.md).