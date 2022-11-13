import type { z, SomeZodObject } from 'zod';
import { Entity } from '.';

export type EntitySchema = SomeZodObject;
export type EntityShape<S extends EntitySchema> = z.infer<S>;

export type EntityClass<S extends EntitySchema> = {
  from(arrayFields: Array<EntityShape<S>>): Array<Entity<S> & EntityShape<S>>;
  from(fields: EntityShape<S>): Entity<S> & EntityShape<S>;

  /**
   * @depreciated use static method `.from(fields: EntityShape<S>)`
   */
  new (fields: EntityShape<S>, schema: S): Entity<S> & EntityShape<S>;
};
