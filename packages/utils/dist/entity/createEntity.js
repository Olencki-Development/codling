import { EntityBaseImplied } from './EntityBase.js';
import { DEFAULT_ENTITY_OPTIONS } from './consts.js';
export function createEntity(schema, entityOptions = DEFAULT_ENTITY_OPTIONS) {
  return class Entity extends EntityBaseImplied {
    constructor(fields) {
      super(schema, fields, entityOptions);
    }
    clone() {
      return new this.constructor(this.toJSON());
    }
  };
}
