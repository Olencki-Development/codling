import {
  EntitySchema,
  EntityShape,
  IEntityBase,
  EntityInstance,
} from './types';

export class EntityBaseImplied<S extends EntitySchema>
  implements IEntityBase<S>
{
  /**
   * Raw unmodified fields that were originally assigned.
   */
  readonly rawFields: EntityShape<S>;

  constructor(fields: EntityShape<S>, readonly schema: S) {
    this.rawFields = fields;
    Object.assign(this, this.schema.parse(fields));
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

    return true;
  }
}

export type EntityBase<S extends EntitySchema> = EntityInstance<
  S,
  EntityBaseImplied<S>
>;
export type EntityBaseClass = {
  new <S extends EntitySchema>(
    fields: EntityShape<S>,
    schema: S
  ): EntityBase<S>;
};
export const EntityBase = EntityBaseImplied as EntityBaseClass;
