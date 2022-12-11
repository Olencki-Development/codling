import { DEFAULT_ENTITY_OPTIONS } from './consts.js';
import {
  EntitySchema,
  EntityInputShape,
  EntityOutputShape,
  IEntityBase,
  EntityOptions,
  Entity,
} from './types.js';

export class EntityBaseImplied<S extends EntitySchema>
  implements IEntityBase<S>
{
  readonly fields: EntityInputShape<S> | Record<string, never>;

  constructor(
    readonly schema: S,
    fields: EntityInputShape<S> | undefined,
    readonly options: EntityOptions = DEFAULT_ENTITY_OPTIONS
  ) {
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
  toJSON(): EntityOutputShape<S> {
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
