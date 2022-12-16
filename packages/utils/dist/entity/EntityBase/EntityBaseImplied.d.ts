import type { ZodError } from 'zod';
import type { Entity } from './types.js';
import type { UnknownObject } from '../types.js';
export declare class EntityBaseImplied<
  Schema extends Entity.Schema,
  Input extends UnknownObject = Entity.InputShape<Schema>
> {
  readonly schema: Schema;
  constructor(schema: Schema, fields: Input | undefined);
  /**
   * Convert the instance to a json object based on the schema values
   * @returns json object of the fields in the schema
   */
  toJSON(): Entity.Shape<Schema>;
  /**
   * Return a stringified json object
   * @param spacing number of spacing for fields in the json
   * @returns Return string json object of toJSON method
   */
  toString(spacing?: number): string;
  /**
   * Validate the instance against the schema
   * @returns ZodError if it exists
   */
  validate(): undefined | ZodError;
  /**
   * Clones the object using the json value to populate the clone
   * @returns new instance of the class
   */
  clone(): Entity.Instance<Schema>;
}
