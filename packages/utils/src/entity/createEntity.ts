import type {
  EntityInstance,
  EntitySchema,
  EntityInputShape,
} from './types.js';
import { EntityBaseImplied } from './EntityBase.js';

type Entity<S extends EntitySchema> = EntityInstance<S>;
type EntityClass<S extends EntitySchema> = {
  new (): Entity<S>;
  new (fields: EntityInputShape<S> | Record<string, never>): Entity<S>;
};

export function createEntity<S extends EntitySchema>(
  schema: S
): EntityClass<S> {
  return class Entity extends EntityBaseImplied<S> {
    constructor(fields: EntityInputShape<S> | Record<string, never> = {}) {
      super(schema, fields);
    }
  };
}
