import type { z, SomeZodObject, ZodError } from 'zod';

export type EntitySchema = SomeZodObject;
export type EntityShape<S extends EntitySchema> = z.infer<S>;

export interface IEntityBase<S extends EntitySchema> {
  readonly rawFields: EntityShape<S>;
  readonly schema: EntityShape<S>;

  toJSON(): EntityShape<S>;
  toString(): string;
  validate(shouldThrow: boolean): true | ZodError;
}

export type EntityInstance<
  S extends EntitySchema,
  T extends IEntityBase<S> = IEntityBase<S>
> = EntityShape<S> & T;
