import type { EntityClass, EntitySchema, EntityShape } from './types';
import { Entity } from './Entity';

export function createEntity<S extends EntitySchema>(
  schema: S
): EntityClass<S> {
  return class InternalEntityClass extends Entity<S> {
    static from(fields: EntityShape<S>): Entity<S> & EntityShape<S>;
    static from(
      arrayFields: Array<EntityShape<S>>
    ): Array<Entity<S> & EntityShape<S>>;
    static from(
      fieldsOrArrayFields: EntityShape<S> | Array<EntityShape<S>>
    ): (Entity<S> & EntityShape<S>) | Array<Entity<S> & EntityShape<S>> {
      if (Array.isArray(fieldsOrArrayFields)) {
        return fieldsOrArrayFields.map((fields) => {
          return new this(fields, schema);
        });
      }
      return new this(fieldsOrArrayFields, schema);
    }

    constructor(fields: EntityShape<S>, readonly schema: S) {
      super(fields, schema);
    }
  };
}
