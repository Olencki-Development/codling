import { z } from 'zod';
import { route } from './index.js';
const User = z.object({ id: z.number(), name: z.string() });
const findUserById = route
  .get('/users/:userId')
  .params(
    z.object({
      userId: z.coerce.number(),
    })
  )
  .response(User);
findUserById.implement((options) => {
  return {
    id: options.params.userId,
    name: 'My user',
  };
});
