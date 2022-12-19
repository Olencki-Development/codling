import type { z } from 'zod';
import { ConfigBuilder } from './ConfigBuilder/index.js';
import type { SomeZodObjectOrIntersection } from './types.js';

/**
 * Create a config builder with the given environment variables and schemas
 * @param envSchema schema to validate env variables against,
 * @param envs environment variables used to hydrate the config
 * @param configSchema schema to validate config against
 * @returns ConfigBuilder
 */
export function makeConfig<
  E extends SomeZodObjectOrIntersection,
  S extends SomeZodObjectOrIntersection
>(envSchema: E, envs: z.infer<E>, configSchema: S) {
  return new ConfigBuilder<never, E, S>({
    envSchema,
    envs,
    registeredConfigs: {},
    configSchema,
  });
}
