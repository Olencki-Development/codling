import type { SafeProcessRequestReturnType } from '../../types.js';
/**
 * Execute the request and return a json result based on the network status
 * @param request fetch request
 * @returns response from fetch request or error
 */
export declare function safeProcessRequestToJSON<T>(
  request: ReturnType<typeof fetch>
): Promise<SafeProcessRequestReturnType<T>>;
/**
 * Execute the request and return a successful json result based on the network status. Otherwise throw the error.
 * @param request fetch request
 * @returns response from fetch request
 */
export declare function processRequestToJSON<T>(
  request: ReturnType<typeof fetch>
): Promise<T>;
