import {
  processRequest,
  safeProcessRequest,
} from './client-oild/processRequest.js';
import {
  processRequestToJSON,
  safeProcessRequestToJSON,
} from './client-oild/processRequestToJSON/index.js';
import {
  processRequestToZodSchema,
  safeProcessRequestToZodSchema,
} from './client-oild/processRequestToZodSchema/index.js';
import {
  processRequestToEntity,
  safeProcessRequestToEntity,
} from './client-oild/processRequestToEntity/index.js';

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

export { default as route } from './Route/route.js';
export { CodlingNetworkError } from './errors/NetworkError.js';
