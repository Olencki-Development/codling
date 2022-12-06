import type { z, SomeZodObject, ZodError, ZodIntersection } from 'zod';
export type EntityOptions = {
  shouldThrowOnInitialization: boolean;
};
export type EntitySchema =
  | SomeZodObject
  | ZodIntersection<SomeZodObject, SomeZodObject>;
export type EntityInputShape<S extends EntitySchema> = z.input<S>;
export type EntityOutputShape<S extends EntitySchema> = z.output<S>;
export interface IEntityBase<S extends EntitySchema> {
  readonly fields: EntityInputShape<S> | Record<string, never>;
  readonly schema: S;
  toJSON(): EntityOutputShape<S>;
  toString(): string;
  validate(shouldThrow: boolean): true | ZodError;
}
export type EntityInstance<
  S extends EntitySchema,
  T extends IEntityBase<S> = IEntityBase<S>
> = EntityOutputShape<S> & T;
