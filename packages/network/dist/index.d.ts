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
export declare const client: {
  processRequest: typeof processRequest;
  safeProcessRequest: typeof safeProcessRequest;
  processRequestToJSON: typeof processRequestToJSON;
  safeProcessRequestToJSON: typeof safeProcessRequestToJSON;
  processRequestToZodSchema: typeof processRequestToZodSchema;
  safeProcessRequestToZodSchema: typeof safeProcessRequestToZodSchema;
  processRequestToEntity: typeof processRequestToEntity;
  safeProcessRequestToEntity: typeof safeProcessRequestToEntity;
};
export * as endpoint from './endpoint/endpoint.js';
