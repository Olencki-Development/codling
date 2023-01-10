/* eslint-disable @typescript-eslint/ban-types */
import { z } from 'zod';
export const RequestMethod = z.enum(['GET', 'POST', 'PATCH', 'DELETE']);
export const EmptyZodObject = z.object({});
