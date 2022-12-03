import { BaseEnvironmentConfig } from './types.js';
export class EnvManager {
  constructor(configSchema, envSchema, configs, environment) {
    this.configSchema = configSchema;
    this.envSchema = envSchema;
    this.configs = configs;
    if (environment) {
      this.environment = environment;
    } else {
      if (process.env.NODE_ENV === 'production') {
        this.environment = 'production';
      } else {
        this.environment = 'local';
      }
    }
  }
  /**
   * A way to get envs from anywhere in the system. This could be from a file or remote source
   * @param cb callback to insert envs into the builder
   */
  onRequestEnvs(cb) {
    this._requestCb = cb;
  }
  /**
   * Populate environment variables into the schema
   * @param cb callback to populate environment variables
   */
  onPopulateConfig(cb) {
    this._populateCb = cb;
    return this;
  }
  /**
   * Request the config entity for the environment
   * @returns Populated config entity
   */
  async fetchConfig() {
    if (this._cachedConfig) {
      return this._cachedConfig;
    }
    if (!this._requestCb) {
      throw Error(
        'Unable to request environment variables. Call "EnvManager::onRequestEnvs" first.'
      );
    }
    if (!this._populateCb) {
      throw Error(
        'Unable to populate config with environment variables. Call "EnvManager::onPopulateConfig" first.'
      );
    }
    const envs = this.envSchema.parse(await this._requestCb());
    const baseConfig = this._getConfigForEnvironment();
    const populatedConfig = this.configSchema
      .and(BaseEnvironmentConfig)
      .parse(await this._populateCb(baseConfig, envs));
    return (this._cachedConfig = populatedConfig);
  }
  _getConfigForEnvironment() {
    const config = this.configs[this.environment];
    if (config) {
      return {
        ...config,
        environment: this.environment,
      };
    }
    return {
      ...this.configs['local'],
      environment: 'local',
    };
  }
}
