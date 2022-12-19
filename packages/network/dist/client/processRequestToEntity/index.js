import { handleUnknownError } from '../../handleUnknownError.js';
import { processRequest } from '../processRequest.js';
import { PROCESS_REQUEST_TO_ENTITY_DEFAULT_OPTIONS } from './consts.js';
/**
 * Execute the request and return a parsed entity class instance based on the network status
 * @param request fetch request
 * @returns response from fetch request or error
 */
export async function safeProcessRequestToEntity(
  request,
  EntityClass,
  options = PROCESS_REQUEST_TO_ENTITY_DEFAULT_OPTIONS
) {
  try {
    const response = await processRequest(request);
    const json = await response.json();
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
export async function processRequestToEntity(
  request,
  EntityClass,
  options = PROCESS_REQUEST_TO_ENTITY_DEFAULT_OPTIONS
) {
  const result = await safeProcessRequestToEntity(
    request,
    EntityClass,
    options
  );
  if (result.success) {
    return result.data;
  }
  throw result.error;
}
