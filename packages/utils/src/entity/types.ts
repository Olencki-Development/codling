import type { z, SomeZodObject, ZodError, ZodIntersection } from 'zod';

export type EntityOptions = Record<string, never>;

export type AnyObject = Record<string, unknown>;
export type EntitySchema =
  | SomeZodObject
  | ZodIntersection<SomeZodObject, SomeZodObject>;
export type EntityShape<S extends EntitySchema> = z.output<S>;
export type EntityInputShape<S extends EntitySchema> = z.input<S>;

export interface IEntityBase<
  ValidationSchema extends EntitySchema,
  Input extends AnyObject = EntityInputShape<ValidationSchema>
> {
  readonly initialValues: Input | Record<string, never>;
  readonly schema: ValidationSchema;

  toJSON(): EntityShape<ValidationSchema>;
  toString(spacing?: number): string;
  validate(): undefined | ZodError;
  clone(): this;
}

export type Entity<S extends EntitySchema = EntitySchema> = EntityShape<S> &
  IEntityBase<S>;
export type EntityClass<
  ValidationSchema extends EntitySchema,
  InputShape extends AnyObject = EntityInputShape<ValidationSchema>
> = {
  new (): Entity<ValidationSchema>;
  new (fields: InputShape): Entity<ValidationSchema>;
};
