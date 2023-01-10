import { processRequest, safeProcessRequest } from './client/processRequest.js';
import {
  processRequestToJSON,
  safeProcessRequestToJSON,
} from './client/processRequestToJSON/index.js';
import {
  processRequestToZodSchema,
  safeProcessRequestToZodSchema,
} from './client/processRequestToZodSchema/index.js';
import {
  processRequestToEntity,
  safeProcessRequestToEntity,
} from './client/processRequestToEntity/index.js';

export const client = {
  processRequest,
  safeProcessRequest,
  processRequestToJSON,
  safeProcessRequestToJSON,
  processRequestToZodSchema,
  safeProcessRequestToZodSchema,
  processRequestToEntity,
  safeProcessRequestToEntity,
};
export * as endpoint from './endpoint/endpoint.js';
