import {
  ConfigEnvPopulateFunc,
  ConfigSchema,
  EnvironmentConfig,
  EnvironmentConfigs,
  Environments,
  EnvSchema,
  RequestEnvFunc,
} from './types.js';
export declare class EnvManager<S extends ConfigSchema, E extends EnvSchema> {
  readonly configSchema: S;
  readonly envSchema: E;
  readonly configs: EnvironmentConfigs<S>;
  readonly environment: Environments;
  protected _requestCb?: RequestEnvFunc<E>;
  protected _populateCb?: ConfigEnvPopulateFunc<S, E>;
  protected _cachedConfig?: EnvironmentConfig<S>;
  constructor(
    configSchema: S,
    envSchema: E,
    configs: EnvironmentConfigs<S>,
    environment?: Environments
  );
  /**
   * A way to get envs from anywhere in the system. This could be from a file or remote source
   * @param cb callback to insert envs into the builder
   */
  onRequestEnvs(cb: RequestEnvFunc<E>): void;
  /**
   * Populate environment variables into the schema
   * @param cb callback to populate environment variables
   */
  onPopulateConfig(cb: ConfigEnvPopulateFunc<S, E>): this;
  /**
   * Request the config entity for the environment
   * @returns Populated config entity
   */
  fetchConfig(): Promise<EnvironmentConfig<S>>;
  protected _getConfigForEnvironment(): EnvironmentConfig<S>;
}
