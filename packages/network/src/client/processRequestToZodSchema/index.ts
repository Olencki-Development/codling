import { handleUnknownError } from '../../handleUnknownError.js';
import type { SafeProcessRequestReturnType } from '../../types.js';
import type { z } from 'zod';
import { processRequestToJSON } from '../processRequestToJSON/index.js';

/**
 * Execute the request and return a json result based on the network status and zod schema
 * @param request fetch request
 * @returns response from fetch request or error
 */
export async function safeProcessRequestToZodSchema<T extends z.ZodTypeAny>(
  request: ReturnType<typeof fetch>,
  schema: T
): Promise<SafeProcessRequestReturnType<z.infer<T>>> {
  try {
    const json = await processRequestToJSON(request);

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
export async function processRequestToZodSchema<T extends z.ZodTypeAny>(
  request: ReturnType<typeof fetch>,
  schema: T
): Promise<z.infer<T>> {
  const result = await safeProcessRequestToZodSchema<T>(request, schema);
  if (result.success) {
    return result.data;
  }

  throw result.error;
}
