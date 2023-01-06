import type { SafeProcessRequestReturnType } from '../../types.js';
import type { z } from 'zod';
/**
 * Execute the request and return a json result based on the network status and zod schema
 * @param request fetch request
 * @returns response from fetch request or error
 */
export declare function safeProcessRequestToZodSchema<T extends z.ZodTypeAny>(
  request: ReturnType<typeof fetch>,
  schema: T
): Promise<SafeProcessRequestReturnType<z.infer<T>>>;
/**
 * Execute the request and return a successful json result based on the network status. Otherwise throw the error.
 * @param request fetch request
 * @returns response from fetch request
 */
export declare function processRequestToZodSchema<T extends z.ZodTypeAny>(
  request: ReturnType<typeof fetch>,
  schema: T
): Promise<z.infer<T>>;
