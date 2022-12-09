import type {
  EntitySchema,
  EntityInputShape,
  EntityOptions,
  EntityClass,
} from './types.js';
import { EntityBaseImplied } from './EntityBase.js';
import { DEFAULT_ENTITY_OPTIONS } from './consts.js';

export function createEntity<S extends EntitySchema>(
  schema: S,
  entityOptions: EntityOptions = DEFAULT_ENTITY_OPTIONS
): EntityClass<S> {
  return class Entity extends EntityBaseImplied<S> {
    constructor(fields?: EntityInputShape<S> | undefined) {
      super(schema, fields, entityOptions);
    }
  };
}
