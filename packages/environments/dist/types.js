import { z } from 'zod';
export const BaseEnvironmentConfig = z.object({
  environment: z.union([
    z.literal('local'),
    z.literal('development'),
    z.literal('production'),
  ]),
});
