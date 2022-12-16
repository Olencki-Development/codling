import { EntityBaseImplied } from '../EntityBase/index.js';
/**
 * Create an custom class for the entity that includes the shape of the schema
 * @param schema zod validation schema that describes the entity shape
 * @returns Class of the entity with fields of the schema
 */
export function createEntity(schema) {
  /**
   * Extend the base entity to override the clone and create a custom constructor for public use
   */
  class Entity extends EntityBaseImplied {
    constructor(fields) {
      super(schema, fields);
    }
    clone() {
      return new this.constructor(this.toJSON());
    }
  }
  return Entity;
}
