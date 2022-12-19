import type { Entity } from '@codling/utils';
import type { SafeProcessRequestReturnType } from '../../types.js';
/**
 * Execute the request and return a parsed entity class instance based on the network status
 * @param request fetch request
 * @returns response from fetch request or error
 */
export declare function safeProcessRequestToEntity<
  E extends Entity.ClassDef<S, I>,
  S extends Entity.Schema,
  I extends Record<string, unknown> = Entity.InputShape<S>
>(
  request: ReturnType<typeof fetch>,
  EntityClass: E,
  options?: import('./types.js').ProcessRequestToEntityOptions
): Promise<SafeProcessRequestReturnType<InstanceType<E>>>;
/**
 * Execute the request and return a successful entity class instance based on the network status. Otherwise throw the error.
 * @param request fetch request
 * @returns response from fetch request
 */
export declare function processRequestToEntity<
  E extends Entity.ClassDef<S, I>,
  S extends Entity.Schema,
  I extends Record<string, unknown> = Entity.InputShape<S>
>(
  request: ReturnType<typeof fetch>,
  EntityClass: E,
  options?: import('./types.js').ProcessRequestToEntityOptions
): Promise<InstanceType<E>>;
