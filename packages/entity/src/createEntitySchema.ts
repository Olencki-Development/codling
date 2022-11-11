import type { SomeZodObject, z } from 'zod';
import { createEntityInstance, type Entity } from './createEntityInstance';
import type { EntitySchemaMethods } from './entityMethods';

/**
 * Base schema fields type
 */
export interface EntitySchema {
  [field: string]: any;
}

/**
 * Base entity class for generating instances of an entity
 */
export type EntityClass<
  T extends EntitySchema,
  M extends EntitySchemaMethods<T>
> = {
  from: (fields: T) => Entity<T, M>;
};

/**
 * Create an instance of an entity generator
 * @param schema zod schema to depict the entity structure
 * @returns Entity generator
 */
export function createEntitySchema<
  T extends SomeZodObject,
  M extends EntitySchemaMethods<z.infer<T>>
>(schema: T, methods: M | undefined = undefined): EntityClass<z.infer<T>, M> {
  const entityClass: EntityClass<z.infer<T>, M> = {
    from: (fields) => createEntityInstance(schema, fields, methods ?? {}),
  };

  return entityClass;
}
