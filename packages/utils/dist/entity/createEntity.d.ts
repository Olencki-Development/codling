import type {
  EntityInstance,
  EntitySchema,
  EntityInputShape,
  EntityOptions,
} from './types.js';
type Entity<S extends EntitySchema> = EntityInstance<S>;
type EntityClass<S extends EntitySchema> = {
  new (): Entity<S>;
  new (fields: EntityInputShape<S>): Entity<S>;
};
export declare function createEntity<S extends EntitySchema>(
  schema: S,
  entityOptions?: EntityOptions
): EntityClass<S>;
export {};
