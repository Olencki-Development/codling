import type { EntitySchema, EntityOptions, EntityClass } from './types.js';
export declare function createEntity<S extends EntitySchema>(
  schema: S,
  entityOptions?: EntityOptions
): EntityClass<S>;
