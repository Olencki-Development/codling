import { EntityBaseImplied } from './EntityBaseImplied.js';
import type { Entity } from './types.js';

export { Entity, EntityBaseImplied };

export type EntityBase<S extends Entity.Schema> = Entity.Instance<S>;
export const EntityBase = EntityBaseImplied as Entity.ClassDefImplied;
