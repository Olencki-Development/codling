import { CodlingNetworkError } from '../errors/NetworkError.js';
import { handleUnknownError } from '../handleUnknownError.js';
import type { SafeProcessRequestReturnType } from '../types.js';

/**
 * Execute the request and return a result based on the network status
 * @param request fetch request
 * @returns response from fetch request or error
 */
export async function safeProcessRequest(
  request: ReturnType<typeof fetch>
): Promise<SafeProcessRequestReturnType<Response>> {
  try {
    const response = await request;
    if (response.ok) {
      return {
        success: true,
        data: response,
      };
    }

    throw new CodlingNetworkError(
      `[${response.url}] failed with status [${response.status}]`,
      response
    );
  } catch (e) {
    return {
      success: false,
      error: handleUnknownError(e),
    };
  }
}

/**
 * Execute the request and return a successful result based on the network status. Otherwise throw the error.
 * @param request fetch request
 * @returns response from fetch request
 */
export async function processRequest(
  request: ReturnType<typeof fetch>
): Promise<Response> {
  const result = await safeProcessRequest(request);
  if (result.success) {
    return result.data;
  }

  throw result.error;
}
