import type { SafeProcessRequestReturnType } from '../types.js';
/**
 * Execute the request and return a result based on the network status
 * @param request fetch request
 * @returns response from fetch request or error
 */
export declare function safeProcessRequest(
  request: ReturnType<typeof fetch>
): Promise<SafeProcessRequestReturnType<Response>>;
/**
 * Execute the request and return a successful result based on the network status. Otherwise throw the error.
 * @param request fetch request
 * @returns response from fetch request
 */
export declare function processRequest(
  request: ReturnType<typeof fetch>
): Promise<Response>;
