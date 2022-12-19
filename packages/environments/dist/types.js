import { z } from 'zod';
/**
 * Available environment keys
 */
export const Environments = z.union([
  z.literal('local'),
  z.literal('development'),
  z.literal('stage'),
  z.literal('production'),
]);
