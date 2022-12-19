import { Environments } from '../types.js';
export class ConfigBuilder {
  constructor(options) {
    this.options = options;
    this.options.envs = options.envSchema.parse(options.envs);
  }
  /**
   * Register a config and return a config builder
   * @param env environment to register config for
   * @param configFunc config resolver function to combine envs and static config variables
   * @returns new instance of ConfigBuilder with the registered config
   */
  register(env, configFunc) {
    const parsedEnv = Environments.parse(env);
    const newConfigs = {
      ...this.options.registeredConfigs,
      [parsedEnv]: configFunc,
    };
    return new ConfigBuilder({
      ...this.options,
      registeredConfigs: newConfigs,
    });
  }
  /**
   * Load a config from its resolver and return the value
   * @param env env to load the config for
   * @returns Populated config
   */
  load(env) {
    const parsedEnv = Environments.parse(env);
    const configFunc = this.options.registeredConfigs[parsedEnv];
    if (!configFunc) {
      throw Error(`Config for [${parsedEnv}] not found.`);
    }
    const config = configFunc(this.options.envs, parsedEnv);
    return this.options.configSchema.parse(config);
  }
}
