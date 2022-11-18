import type { EntityInstance, EntitySchema, EntityShape } from './types';
import { EntityBaseImplied } from './EntityBase';

type Entity<S extends EntitySchema> = EntityInstance<S>;
type EntityClass<S extends EntitySchema> = {
  new (fields: EntityShape<S>): Entity<S>;
};

export function createEntity<S extends EntitySchema>(
  schema: S
): EntityClass<S> {
  return class Entity extends EntityBaseImplied<S> {
    constructor(fields: EntityShape<S>) {
      super(fields, schema);
    }
  };
}
