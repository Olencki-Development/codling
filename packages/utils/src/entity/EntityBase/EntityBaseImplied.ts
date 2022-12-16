import type { ZodError } from 'zod';
import type { Entity } from './types.js';
import type { UnknownObject } from '../types.js';

export class EntityBaseImplied<
  Schema extends Entity.Schema,
  Input extends UnknownObject = Entity.InputShape<Schema>
> {
  constructor(readonly schema: Schema, fields: Input | undefined) {
    const initialValues = fields ?? {};
    if (fields) {
      Object.assign(this, initialValues);
    }
  }

  /**
   * Convert the instance to a json object based on the schema values
   * @returns json object of the fields in the schema
   */
  toJSON(): Entity.Shape<Schema> {
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
   * @returns ZodError if it exists
   */
  validate(): undefined | ZodError {
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
    const EntityClassHelper = this.constructor as Entity.ClassDefImplied;
    return new EntityClassHelper(this.schema, this.toJSON());
  }
}
