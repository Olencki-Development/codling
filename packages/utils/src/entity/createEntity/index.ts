import type { UnknownObject } from '../types.js';
import { type Entity, EntityBaseImplied } from '../EntityBase/index.js';

/**
 * Create an custom class for the entity that includes the shape of the schema
 * @param schema zod validation schema that describes the entity shape
 * @returns Class of the entity with fields of the schema
 */
export function createEntity<
  Schema extends Entity.Schema,
  Input extends UnknownObject = Entity.InputShape<Schema>
>(schema: Schema): Entity.ClassDef<Schema, Input> {
  /**
   * Extend the base entity to override the clone and create a custom constructor for public use
   */
  class Entity extends EntityBaseImplied<Schema, Input> {
    constructor(fields?: Input | undefined) {
      super(schema, fields);
    }

    clone() {
      return new (this.constructor as Entity.ClassDef<Schema, Input>)(
        this.toJSON()
      );
    }
  }

  return Entity as Entity.ClassDef<Schema, Input>;
}
