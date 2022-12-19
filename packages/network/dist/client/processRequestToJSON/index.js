import { handleUnknownError } from '../../handleUnknownError.js';
import { processRequest } from '../processRequest.js';
/**
 * Execute the request and return a json result based on the network status
 * @param request fetch request
 * @returns response from fetch request or error
 */
export async function safeProcessRequestToJSON(request) {
  try {
    const response = await processRequest(request);
    const json = await response.json();
    return {
      success: true,
      data: json,
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
export async function processRequestToJSON(request) {
  const result = await safeProcessRequestToJSON(request);
  if (result.success) {
    return result.data;
  }
  throw result.error;
}
