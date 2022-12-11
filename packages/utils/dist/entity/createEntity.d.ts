import type {
  EntitySchema,
  EntityInputShape,
  EntityOptions,
  EntityClass,
  AnyObject,
} from './types.js';
export declare function createEntity<
  ValidationSchema extends EntitySchema,
  Input extends AnyObject = EntityInputShape<ValidationSchema>
>(
  schema: ValidationSchema,
  entityOptions?: EntityOptions
): EntityClass<ValidationSchema, Input>;
