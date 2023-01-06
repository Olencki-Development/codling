import { handleUnknownError } from '../../handleUnknownError.js';
import { processRequest } from '../processRequest.js';
/**
 * Execute the request and return a json result based on the network status and zod schema
 * @param request fetch request
 * @returns response from fetch request or error
 */
export async function safeProcessRequestToZodSchema(request, schema) {
  try {
    const response = await processRequest(request);
    const json = await response.json();
    return {
      success: true,
      data: schema.parse(json),
    };
  } catch (e) {
    return {
      success: false,
      error: handleUnknownError(e),
    };
  }
}
/**
 * Execute the request and return a successful json result based on the network status. Otherwise throw the error.
 * @param request fetch request
 * @returns response from fetch request
 */
export async function processRequestToZodSchema(request, schema) {
  const result = await safeProcessRequestToZodSchema(request, schema);
  if (result.success) {
    return result.data;
  }
  throw result.error;
}
