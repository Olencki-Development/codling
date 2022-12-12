import type { ZodError } from 'zod';
import type {
  AnyObject,
  EntitySchema,
  EntityInputShape,
  EntityShape,
  IEntityBase,
  EntityOptions,
  Entity,
} from './types.js';
export declare class EntityBaseImplied<
  ValidationSchema extends EntitySchema,
  Input extends AnyObject = EntityInputShape<ValidationSchema>
> implements IEntityBase<ValidationSchema, Input>
{
  readonly schema: ValidationSchema;
  readonly options: EntityOptions;
  readonly initialValues: Input | Record<string, never>;
  constructor(
    schema: ValidationSchema,
    fields: Input | undefined,
    options?: EntityOptions
  );
  /**
   * Convert the instance to a json object based on the schema values
   * @returns json object of the fields in the schema
   */
  toJSON(): EntityShape<ValidationSchema>;
  /**
   * Return a stringified json object
   * @param spacing number of spacing for fields in the json
   * @returns Return string json object of toJSON method
   */
  toString(spacing?: number): string;
  /**
   * Validate the instance against the schema
   * @returns true
   */
  validate(): undefined | ZodError;
  /**
   * Clones the object using the json value to populate the clone
   * @returns new instance of the class
   */
  clone(): EntityBase<ValidationSchema>;
}
export type EntityBaseClass = {
  new <S extends EntitySchema>(
    schema: S,
    fields?: EntityInputShape<S> | never,
    options?: EntityOptions
  ): EntityBase<S>;
};
export type EntityBase<S extends EntitySchema> = Entity<S>;
export declare const EntityBase: EntityBaseClass;
