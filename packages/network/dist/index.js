import { processRequest, safeProcessRequest } from './client/processRequest.js';
import {
  processRequestToJSON,
  safeProcessRequestToJSON,
} from './client/processRequestToJSON/index.js';
import {
  processRequestToEntity,
  safeProcessRequestToEntity,
} from './client/processRequestToEntity/index.js';
export const client = {
  processRequest,
  safeProcessRequest,
  processRequestToJSON,
  safeProcessRequestToJSON,
  processRequestToEntity,
  safeProcessRequestToEntity,
};
