/* eslint-disable @typescript-eslint/ban-types */
import { z } from 'zod';
export const RouteMethod = z.enum(['GET', 'POST', 'PATCH', 'DELETE']);
