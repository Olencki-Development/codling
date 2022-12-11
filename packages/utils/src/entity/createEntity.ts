import type {
  EntitySchema,
  EntityInputShape,
  EntityOptions,
  EntityClass,
  AnyObject,
} from './types.js';
import { EntityBaseImplied } from './EntityBase.js';
import { DEFAULT_ENTITY_OPTIONS } from './consts.js';

export function createEntity<
  ValidationSchema extends EntitySchema,
  Input extends AnyObject = EntityInputShape<ValidationSchema>
>(
  schema: ValidationSchema,
  entityOptions: EntityOptions = DEFAULT_ENTITY_OPTIONS
): EntityClass<ValidationSchema, Input> {
  return class Entity extends EntityBaseImplied<ValidationSchema, Input> {
    constructor(fields?: Input | undefined) {
      super(schema, fields, entityOptions);
    }

    clone() {
      return new (this.constructor as EntityClass<ValidationSchema, Input>)(
        this.toJSON()
      );
    }
  };
}
