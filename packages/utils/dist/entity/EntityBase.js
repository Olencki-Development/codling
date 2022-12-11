import { DEFAULT_ENTITY_OPTIONS } from './consts.js';
export class EntityBaseImplied {
  constructor(schema, fields, options = DEFAULT_ENTITY_OPTIONS) {
    this.schema = schema;
    this.options = options;
    this.initialValues = fields ?? {};
    if (fields) {
      Object.assign(this, this.initialValues);
    }
  }
  /**
   * Convert the instance to a json object based on the schema values
   * @returns json object of the fields in the schema
   */
  toJSON() {
    return this.schema.parse(this);
  }
  /**
   * Return a stringified json object
   * @param spacing number of spacing for fields in the json
   * @returns Return string json object of toJSON method
   */
  toString(spacing = 2) {
    const json = this.toJSON();
    return JSON.stringify(json, undefined, spacing);
  }
  /**
   * Validate the instance against the schema
   * @returns true
   */
  validate() {
    const result = this.schema.safeParse(this);
    if (!result.success && result.error) {
      return result.error;
    }
    if (result.success) {
      Object.assign(this, result.data);
    }
    return undefined;
  }
  /**
   * Clones the object using the json value to populate the clone
   * @returns new instance of the class
   */
  clone() {
    const EntityClassHelper = this.constructor;
    return new EntityClassHelper(this.schema, this.toJSON(), this.options);
  }
}
export const EntityBase = EntityBaseImplied;
