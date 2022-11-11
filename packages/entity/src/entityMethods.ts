import type { Entity } from './createEntityInstance';
import type { EntitySchema } from './createEntitySchema';

/**
 * Definition for a entity method
 */
export type EntityMethod<
  T extends EntitySchema,
  A extends any[] = [],
  R = unknown
> = (this: Entity<T>, ...args: A) => R;

/**
 * Custom entity method configuration
 */
export interface EntitySchemaMethods<T extends EntitySchema> {
  [funcName: string]: EntityMethod<T, [], unknown>;
}
