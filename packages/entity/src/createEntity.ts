import type { EntityClass, EntitySchema, EntityShape } from './types';
import { Entity } from './Entity';

export function createEntity<S extends EntitySchema>(
  schema: S
): EntityClass<S> {
  return class InternalEntityClass extends Entity<S> {
    static from(fields: EntityShape<S>): Entity<S> & EntityShape<S> {
      return new this(fields, schema);
    }

    constructor(fields: EntityShape<S>, readonly schema: S) {
      super(fields, schema);
    }
  };
}
