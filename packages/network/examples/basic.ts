import { z } from 'zod';
import { HttpClient, route, JSONDataCoder } from '../dist/index';

const createUser = route
  .post('/users')
  .body(
    z.object({
      name: z.string().trim().min(1),
    })
  )
  .response(
    z.object({
      id: z.number(),
      name: z.string().trim().min(1),
    })
  );

const handler = createUser.implement((options) => {
  return {
    id: 1,
    name: options.body.name,
  };
});

const client = new HttpClient({
  url: 'http://localhost:8000',
  coder: new JSONDataCoder(),
});
client.onStatus(403, (response) => {
  // do something
});

const user = await client
  .request(createUser, {
    body: {
      name: 'My name',
    },
  })
  .execute(window.fetch);

if (user.success) {
  // user.data
} else {
  // user.error
}
