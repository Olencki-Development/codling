import {
  EntitySchema,
  EntityInputShape,
  EntityOutputShape,
  IEntityBase,
  EntityOptions,
  Entity,
} from './types.js';
export declare class EntityBaseImplied<S extends EntitySchema>
  implements IEntityBase<S>
{
  readonly schema: S;
  readonly options: EntityOptions;
  readonly fields: EntityInputShape<S> | Record<string, never>;
  constructor(
    schema: S,
    fields: EntityInputShape<S> | undefined,
    options?: EntityOptions
  );
  /**
   * Convert the instance to a json object based on the schema values
   * @returns json object of the fields in the schema
   */
  toJSON(): EntityOutputShape<S>;
  /**
   * Return a stringified json object
   * @param spacing number of spacing for fields in the json
   * @returns Return string json object of toJSON method
   */
  toString(spacing?: number): string;
  /**
   * Validate the instance against the schema
   * @param shouldThrow throw an error if the validation fails (default false)
   * @returns true
   */
  validate(shouldThrow?: boolean): true | import('zod').ZodError<any>;
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
