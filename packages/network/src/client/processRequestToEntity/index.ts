import type { Entity } from '@codling/utils';
import { handleUnknownError } from '../../handleUnknownError.js';
import { processRequest } from '../processRequest.js';
import type { SafeProcessRequestReturnType } from '../../types.js';
import { PROCESS_REQUEST_TO_ENTITY_DEFAULT_OPTIONS } from './consts.js';

/**
 * Execute the request and return a parsed entity class instance based on the network status
 * @param request fetch request
 * @returns response from fetch request or error
 */
export async function safeProcessRequestToEntity<
  E extends Entity.ClassDef<S, I>,
  S extends Entity.Schema,
  I extends Record<string, unknown> = Entity.InputShape<S>
>(
  request: ReturnType<typeof fetch>,
  EntityClass: E,
  options = PROCESS_REQUEST_TO_ENTITY_DEFAULT_OPTIONS
): Promise<SafeProcessRequestReturnType<InstanceType<E>>> {
  try {
    const response = await processRequest(request);
    const json = (await response.json()) as Entity.Shape<
      InstanceType<E>['schema']
    >;
    const entity = new EntityClass(json);
    if (!options.validateEntity) {
      return {
        success: true,
        data: entity,
      };
    }

    const validationError = entity.validate();
    if (validationError) {
      throw validationError;
    }

    return {
      success: true,
      data: entity,
    };
  } catch (e) {
    return {
      success: false,
      error: handleUnknownError(e),
    };
  }
}

/**
 * Execute the request and return a successful entity class instance based on the network status. Otherwise throw the error.
 * @param request fetch request
 * @returns response from fetch request
 */
export async function processRequestToEntity<
  E extends Entity.ClassDef<S, I>,
  S extends Entity.Schema,
  I extends Record<string, unknown> = Entity.InputShape<S>
>(
  request: ReturnType<typeof fetch>,
  EntityClass: E,
  options = PROCESS_REQUEST_TO_ENTITY_DEFAULT_OPTIONS
): Promise<InstanceType<E>> {
  const result = await safeProcessRequestToEntity<E, S, I>(
    request,
    EntityClass,
    options
  );
  if (result.success) {
    return result.data;
  }

  throw result.error;
}
