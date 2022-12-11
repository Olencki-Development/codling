import { ZodError } from 'zod';
import { DEFAULT_ENTITY_OPTIONS } from './consts.js';
import {
  AnyObject,
  EntitySchema,
  EntityInputShape,
  EntityShape,
  IEntityBase,
  EntityOptions,
  Entity,
} from './types.js';

export class EntityBaseImplied<
  ValidationSchema extends EntitySchema,
  Input extends AnyObject = EntityInputShape<ValidationSchema>
> implements IEntityBase<ValidationSchema, Input>
{
  readonly initialValues: Input | Record<string, never>;

  constructor(
    readonly schema: ValidationSchema,
    fields: Input | undefined,
    readonly options: EntityOptions = DEFAULT_ENTITY_OPTIONS
  ) {
    this.initialValues = fields ?? {};
    if (fields) {
      Object.assign(this, this.initialValues);
    }
  }

  /**
   * Convert the instance to a json object based on the schema values
   * @returns json object of the fields in the schema
   */
  toJSON(): EntityShape<ValidationSchema> {
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
    const EntityClassHelper = this.constructor as EntityBaseClass;
    return new EntityClassHelper(this.schema, this.toJSON(), this.options);
  }
}

export type EntityBaseClass = {
  new <S extends EntitySchema>(
    schema: S,
    fields?: EntityInputShape<S> | never,
    options?: EntityOptions
  ): EntityBase<S>;
};
export type EntityBase<S extends EntitySchema> = Entity<S>;
export const EntityBase = EntityBaseImplied as EntityBaseClass;
