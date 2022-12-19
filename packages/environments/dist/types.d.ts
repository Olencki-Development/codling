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
export declare const Environments: z.ZodUnion<
  [
    z.ZodLiteral<'local'>,
    z.ZodLiteral<'development'>,
    z.ZodLiteral<'stage'>,
    z.ZodLiteral<'production'>
  ]
>;
export type Environments = z.infer<typeof Environments>;
