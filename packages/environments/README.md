# @codling/environments
> An environment management tool for populating private environment variables into non-sensative objects.

### Examples

##### Basic Example

```
import { EnvManager } from '@codling/environments'

const configSchema = z.object({
  domain: z.string().url(),
  database: z.object({
    url: z.string().url(),
    username: z.string(),
    password: z.string()
  })
});
const envSchema = configSchema.pick({
  database: {
    password: true
  }
});
const localConfig: z.infer<typeof configSchema> = {
  domain: 'https://localhost:8000',
  database: {
    url: 'http://localhost:5123',
    username: 'admin',
    password: ''
  }
};

const envManager = new EnvManager(
  configSchema,
  envSchema,
  { local: localConfig },
  'local'
)
envManager.onRequestEnvs(() => {
  return {
    database: {
      password: 'my-pass'
    }
  }
})
envManager.onPopulateConfig((baseConfig, envs) => {
  baseConfig.database.password = envs.database.password;
  return baseConfig;
})

const config = await envManager.fetchConfig(); // local config object populated with envs
...

```