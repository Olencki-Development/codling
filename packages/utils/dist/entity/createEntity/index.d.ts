import type { UnknownObject } from '../types.js';
import { type Entity } from '../EntityBase/index.js';
/**
 * Create an custom class for the entity that includes the shape of the schema
 * @param schema zod validation schema that describes the entity shape
 * @returns Class of the entity with fields of the schema
 */
export declare function createEntity<
  Schema extends Entity.Schema,
  Input extends UnknownObject = Entity.InputShape<Schema>
>(schema: Schema): Entity.ClassDef<Schema, Input>;
