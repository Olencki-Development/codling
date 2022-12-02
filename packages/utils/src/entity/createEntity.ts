import type {
  EntityInstance,
  EntitySchema,
  EntityInputShape,
  EntityOptions,
} from './types.js';
import { EntityBaseImplied } from './EntityBase.js';
import { DEFAULT_ENTITY_OPTIONS } from './consts.js';

type Entity<S extends EntitySchema> = EntityInstance<S>;
type EntityClass<S extends EntitySchema> = {
  new (): Entity<S>;
  new (fields: EntityInputShape<S> | Record<string, never>): Entity<S>;
};

export function createEntity<S extends EntitySchema>(
  schema: S,
  entityOptions: EntityOptions = DEFAULT_ENTITY_OPTIONS
): EntityClass<S> {
  return class Entity extends EntityBaseImplied<S> {
    constructor(fields: EntityInputShape<S> | Record<string, never> = {}) {
      super(schema, fields, entityOptions);
    }
  };
}
