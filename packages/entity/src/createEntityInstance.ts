import type { SomeZodObject, z, ZodError, ZodObject } from 'zod';
import type { EntitySchema } from './createEntitySchema';
import type { EntityMethod, EntitySchemaMethods } from './entityMethods';

/**
 * Base entity type with extendable fields and methods
 */
export type Entity<
  T extends EntitySchema = EntitySchema,
  M extends EntitySchemaMethods<T> = {} // eslint-disable-line @typescript-eslint/ban-types
> = T & {
  [funcName in keyof M]: EntityMethod<
    T,
    Parameters<M[funcName]>,
    ReturnType<M[funcName]>
  >;
} & {
  schema: ZodObject<T>;
  toJSON: EntityMethod<T, [], T>;
  toString: EntityMethod<T, [number] | [], string>;
  validate: EntityMethod<T, [boolean] | [], true | ZodError>;
};

/**
 * Create a new entity instance from an object and validate input
 * @param schema zod schema to validate the fields against
 * @param fields object to populate the entity with
 * @returns newly created entity instance
 */
export function createEntityInstance<T extends SomeZodObject>(
  schema: T,
  fields: z.infer<T>,
  methods: EntitySchemaMethods<T>
): Entity<z.infer<T>> {
  const parsedFields = schema.parse(fields);
  const instance = {
    ...parsedFields,
    ...Object.entries(methods).reduce(
      (output: EntitySchemaMethods<T>, [key, value]) => {
        output[key] = value.bind(parsedFields);
        return output;
      },
      {}
    ),
  };

  Object.defineProperty(instance, 'schema', {
    value: schema,
    writable: false,
  });

  instance.toJSON = function () {
    return this.schema.parse(this);
  };
  instance.toString = function (spacing = 2) {
    const json = this.toJSON();
    return JSON.stringify(json, undefined, spacing);
  };
  instance.validate = function (shouldThrow = false) {
    const result = schema.safeParse(instance);
    if (!result.success && result.error) {
      if (shouldThrow) {
        throw result.error;
      }

      return result.error;
    }

    return true;
  };

  return instance;
}
