import { ConfigBuilder } from './ConfigBuilder/index.js';
/**
 * Create a config builder with the given environment variables and schemas
 * @param envSchema schema to validate env variables against,
 * @param envs environment variables used to hydrate the config
 * @param configSchema schema to validate config against
 * @returns ConfigBuilder
 */
export function makeConfig(envSchema, envs, configSchema) {
  return new ConfigBuilder({
    envSchema,
    envs,
    registeredConfigs: {},
    configSchema,
  });
}
