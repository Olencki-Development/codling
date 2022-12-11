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
  toString(spacing?: number): string;
  validate(shouldThrow?: boolean): undefined | ZodError;
  clone(): this;
}
export type Entity<S extends EntitySchema = EntitySchema> =
  EntityOutputShape<S> & IEntityBase<S>;
export type EntityClass<S extends EntitySchema> = {
  new (): Entity<S>;
  new (fields: EntityInputShape<S>): Entity<S>;
};
export declare namespace Entity {
  type InferFields<
    E extends Entity<S>,
    S extends EntitySchema = EntitySchema
  > = EntityOutputShape<E['schema']>;
  type InferInputFields<
    E extends Entity<S>,
    S extends EntitySchema = EntitySchema
  > = EntityInputShape<E['schema']>;
}
