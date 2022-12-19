import type { z } from 'zod';
import { Environments, SomeZodObjectOrIntersection } from '../types.js';
import type {
  ConfigBuilderOptions,
  RegisterConfigBuilderFunc,
} from './types.js';
export declare class ConfigBuilder<
  Envs extends Environments,
  EnvSchema extends SomeZodObjectOrIntersection,
  ConfigSchema extends SomeZodObjectOrIntersection
> {
  readonly options: ConfigBuilderOptions<Envs, EnvSchema, ConfigSchema>;
  constructor(options: ConfigBuilderOptions<Envs, EnvSchema, ConfigSchema>);
  /**
   * Register a config and return a config builder
   * @param env environment to register config for
   * @param configFunc config resolver function to combine envs and static config variables
   * @returns new instance of ConfigBuilder with the registered config
   */
  register<NewEnv extends Environments>(
    env: NewEnv,
    configFunc: RegisterConfigBuilderFunc<EnvSchema, ConfigSchema>
  ): ConfigBuilder<Envs | NewEnv, EnvSchema, ConfigSchema>;
  /**
   * Load a config from its resolver and return the value
   * @param env env to load the config for
   * @returns Populated config
   */
  load(env: Envs): z.infer<ConfigSchema>;
}
