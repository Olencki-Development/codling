import { z } from 'zod';
import { HttpClient, JSONDataCoder, route } from './index.js';
import fetch from 'node-fetch';
const User = z.object({ id: z.number(), name: z.string() });
const findUserById = route
  .get('/users/:userId')
  .params(
    z.object({
      userId: z.number(),
    })
  )
  .response(User);
const createUser = route
  .post('/users')
  .body(
    z.object({
      name: z.string(),
    })
  )
  .response(User);
findUserById.implement((options) => {
  return {
    id: options.params.userId,
    name: 'My name',
  };
});
createUser.implement((options) => {
  return {
    id: 1,
    name: options.body.name,
  };
});
const client = new HttpClient({
  url: 'https://jsonplaceholder.typicode.com',
  coder: new JSONDataCoder(),
});
// const request = client.request(findUserById, {
//   params: {
//     userId: 1
//   }
// })
const request = client.request(createUser, {
  body: {
    name: 'My name',
  },
});
console.log(request.getUrl(), request.getData());
const result = await request.execute(fetch);
result.success === true ? result.data.id.toString() : null;
console.log(result);
