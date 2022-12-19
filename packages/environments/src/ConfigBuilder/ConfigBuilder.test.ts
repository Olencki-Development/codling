import { ConfigBuilder } from './index.js';
import { z } from 'zod';

describe('@codling/environments/ConfigBuilder', function () {
  const envSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
  });
  const configSchema = z
    .object({
      host: z.string().url(),
    })
    .merge(envSchema);

  describe('ConfigBuilder', function () {
    it('should return instance with properties set', function () {
      const instance = new ConfigBuilder({
        envSchema,
        envs: {
          username: 'username',
          password: 'password',
        },
        configSchema,
        registeredConfigs: {} as never,
      });
      this.assert.instanceOf(instance, ConfigBuilder);
      this.assert.containsAllKeys(instance, [
        'envs',
        '_envSchema',
        '_configSchema',
        '_registeredConfigs',
      ]);
    });

    describe('register', function () {
      let instance: ConfigBuilder<never, typeof envSchema, typeof configSchema>;
      beforeEach(function () {
        instance = new ConfigBuilder({
          envSchema,
          envs: {
            username: 'username',
            password: 'password',
          },
          configSchema,
          registeredConfigs: {},
        });
      });

      it('should return new instance', function () {
        const nextConfig = instance.register('development', function (envs) {
          return {
            ...envs,
            host: 'https://localhost:8000',
          };
        });
        this.assert.notEqual(nextConfig, instance);
      });

      it('should register config for key', function () {
        const nextConfig = instance
          .register('development', function (envs) {
            return {
              ...envs,
              host: 'https://localhost:8000',
            };
          })
          .register('local', function (envs) {
            return {
              ...envs,
              host: 'https://localhost:8000',
            };
          });

        this.assert.hasAllKeys(nextConfig.options.registeredConfigs, [
          'development',
        ]);
        this.assert.isFunction(
          nextConfig.options.registeredConfigs.development
        );
        this.assert.isFunction(nextConfig.options.registeredConfigs.local);
      });
    });
  });
});
