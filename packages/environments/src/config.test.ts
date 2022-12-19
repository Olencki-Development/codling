import { makeConfig } from './config.js';
import { z } from 'zod';
import { ConfigBuilder } from './ConfigBuilder/index.js';

describe('@codling/environments/config', function () {
  describe('makeConfig', function () {
    const envSchema = z.object({
      username: z.string().min(1),
      password: z.string().min(1),
    });
    const configSchema = z
      .object({
        host: z.string().url(),
      })
      .merge(envSchema);

    it('should return instance of config builder', function () {
      const result = makeConfig(
        envSchema,
        {
          username: 'username',
          password: 'password',
        },
        configSchema
      );
      this.assert.instanceOf(result, ConfigBuilder);
    });
  });
});
