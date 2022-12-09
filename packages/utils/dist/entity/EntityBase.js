import { DEFAULT_ENTITY_OPTIONS } from './consts.js';
export class EntityBaseImplied {
  constructor(schema, fields, options = DEFAULT_ENTITY_OPTIONS) {
    this.schema = schema;
    this.options = options;
    this.fields = fields ?? {};
    if (fields) {
      Object.assign(this, this.fields);
      this.validate(this.options.shouldThrowOnInitialization);
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
   * @param shouldThrow throw an error if the validation fails (default false)
   * @returns true
   */
  validate(shouldThrow = false) {
    const result = this.schema.safeParse(this);
    if (!result.success && result.error) {
      if (shouldThrow) {
        throw result.error;
      }
      return result.error;
    }
    if (result.success) {
      Object.assign(this, result.data);
    }
    return true;
  }
}
export const EntityBase = EntityBaseImplied;
