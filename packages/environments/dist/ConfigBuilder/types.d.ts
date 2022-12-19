import type { z } from 'zod';
import type { Environments, SomeZodObjectOrIntersection } from '../types.js';
/**
 * Config register function
 */
export type RegisterConfigBuilderFunc<
  EnvSchema extends SomeZodObjectOrIntersection,
  ConfigSchema extends SomeZodObjectOrIntersection
> = (
  envs: z.infer<EnvSchema>,
  environment: Environments
) => z.infer<ConfigSchema>;
/**
 * Map of registered configs
 */
export type RegisteredConfigs<
  Envs extends Environments,
  EnvSchema extends SomeZodObjectOrIntersection,
  ConfigSchema extends SomeZodObjectOrIntersection
> = {
  [env in Envs]: RegisterConfigBuilderFunc<EnvSchema, ConfigSchema>;
};
/**
 * Options to pass into ConfigBuilder
 */
export type ConfigBuilderOptions<
  Envs extends Environments,
  EnvSchema extends SomeZodObjectOrIntersection,
  ConfigSchema extends SomeZodObjectOrIntersection
> = {
  envSchema: EnvSchema;
  envs: z.input<EnvSchema>;
  configSchema: ConfigSchema;
  registeredConfigs: RegisteredConfigs<Envs, EnvSchema, ConfigSchema>;
};
