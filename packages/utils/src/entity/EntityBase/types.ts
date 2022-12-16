import type { SomeZodObject, z, ZodIntersection } from 'zod';
import type { UnknownObject } from '../types.js';
import type { EntityBaseImplied } from './EntityBaseImplied.js';

/* eslint-disable @typescript-eslint/no-namespace */

/**
 * Entity helper types
 */
export namespace Entity {
  /**
   * Allowed schema types for the entity to be written for
   */
  export type Schema =
    | SomeZodObject
    | ZodIntersection<SomeZodObject, SomeZodObject>;

  /**
   * Parsed shape of the schema
   */
  export type Shape<S extends Schema> = z.output<S>;

  /**
   * Parsed input shape of the schema
   */
  export type InputShape<S extends Schema> = z.input<S>;

  /**
   * Entity helper type to describe the base class and the schema proeprties assigend with Object.assign
   */
  export type Instance<S extends Schema> = EntityBaseImplied<S> & Shape<S>;

  /**
   * Entity class helper type to describe constructor and static methods on the base class and Entity
   */
  export type ClassDef<
    S extends Schema,
    I extends UnknownObject = InputShape<S>
  > = {
    new (): Instance<S>;
    new (fields: I): Instance<S>;
  };

  export type ClassDefImplied = {
    new <S extends Schema, I extends UnknownObject = InputShape<S>>(
      schema: S,
      fields?: I | undefined
    ): Instance<S>;
  };
}
