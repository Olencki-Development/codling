import { type SomeZodObject, type ZodIntersection, z } from 'zod';

/**
 * Zod schema types for an object
 */
export type SomeZodObjectOrIntersection =
  | SomeZodObject
  | ZodIntersection<SomeZodObject, SomeZodObject>;

/**
 * Available environment keys
 */
export const Environments = z.union([
  z.literal('local'),
  z.literal('development'),
  z.literal('stage'),
  z.literal('production'),
]);
export type Environments = z.infer<typeof Environments>;
