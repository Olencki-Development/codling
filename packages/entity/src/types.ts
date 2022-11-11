import type { z, SomeZodObject } from 'zod';
import { Entity } from './Entity';

export type EntitySchema = SomeZodObject;
export type EntityShape<S extends EntitySchema> = z.infer<S>;

export type EntityClass<S extends EntitySchema> = {
  from(fields: EntityShape<S>): Entity<S> & EntityShape<S>;

  /**
   * @depreciated use static method `.from(fields: EntityShape<S>)`
   */
  new (fields: EntityShape<S>, schema: S): Entity<S> & EntityShape<S>;
};
