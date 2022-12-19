import type { z } from 'zod';
import { Environments, SomeZodObjectOrIntersection } from '../types.js';
import type {
  ConfigBuilderOptions,
  RegisterConfigBuilderFunc,
  RegisteredConfigs,
} from './types.js';

export class ConfigBuilder<
  Envs extends Environments,
  EnvSchema extends SomeZodObjectOrIntersection,
  ConfigSchema extends SomeZodObjectOrIntersection
> {
  constructor(
    readonly options: ConfigBuilderOptions<Envs, EnvSchema, ConfigSchema>
  ) {
    this.options.envs = options.envSchema.parse(options.envs);
  }

  /**
   * Register a config and return a config builder
   * @param env environment to register config for
   * @param configFunc config resolver function to combine envs and static config variables
   * @returns new instance of ConfigBuilder with the registered config
   */
  register<NewEnv extends Environments>(
    env: NewEnv,
    configFunc: RegisterConfigBuilderFunc<EnvSchema, ConfigSchema>
  ) {
    const parsedEnv = Environments.parse(env);

    const newConfigs = {
      ...this.options.registeredConfigs,
      [parsedEnv]: configFunc,
    } as RegisteredConfigs<Envs | NewEnv, EnvSchema, ConfigSchema>;
    return new ConfigBuilder<NewEnv | Envs, EnvSchema, ConfigSchema>({
      ...this.options,
      registeredConfigs: newConfigs,
    });
  }

  /**
   * Load a config from its resolver and return the value
   * @param env env to load the config for
   * @returns Populated config
   */
  load(env: Envs): z.infer<ConfigSchema> {
    const parsedEnv = Environments.parse(env) as Envs;

    const configFunc = this.options.registeredConfigs[parsedEnv] as
      | RegisterConfigBuilderFunc<EnvSchema, ConfigSchema>
      | undefined;
    if (!configFunc) {
      throw Error(`Config for [${parsedEnv}] not found.`);
    }
    const config = configFunc(this.options.envs, parsedEnv);
    return this.options.configSchema.parse(config);
  }
}
