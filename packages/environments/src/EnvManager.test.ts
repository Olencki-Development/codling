import { EnvManager } from './index';
import { z } from 'zod';

describe('@codling/environments/EnvManager', function () {
  const configSchema = z.object({
    foo: z.literal('bar'),
    count: z.number(),
    url: z.string().url(),
  });
  const envSchema = configSchema.pick({
    url: true,
  });
  const localConfig: z.infer<typeof configSchema> = {
    foo: 'bar',
    count: 1,
    url: '',
  };
  let instance: EnvManager<typeof configSchema, typeof envSchema>;

  beforeEach(function () {
    instance = new EnvManager(
      configSchema,
      envSchema,
      { local: localConfig },
      'local'
    );
  });

  it('should throw if onRequestEnvs is not set', async function () {
    try {
      await instance.fetchConfig();
      throw new Error('Should not have passed.');
    } catch (e: unknown) {
      if (e instanceof Error) {
        this.assert.equal(
          e.message,
          'Unable to request environment variables. Call "EnvManager::onRequestEnvs" first.'
        );
      } else {
        this.assert.isEmpty(e);
      }
    }
  });

  it('should throw if onPopulateConfig is not set', async function () {
    const envStub = this.sinon
      .stub()
      .resolves({ url: 'https://localhost:8000' });
    try {
      instance.onRequestEnvs(envStub);

      await instance.fetchConfig();
      throw new Error('Should not have passed.');
    } catch (e: unknown) {
      if (e instanceof Error) {
        this.assert.equal(
          e.message,
          'Unable to populate config with environment variables. Call "EnvManager::onPopulateConfig" first.'
        );
      } else {
        this.assert.isEmpty(e);
      }
      this.assert.notCalled(envStub);
    }
  });

  it('should call functions when getting config', async function () {
    const envStub = this.sinon
      .stub()
      .resolves({ url: 'https://localhost:8000' });
    instance.onRequestEnvs(envStub);

    const populateStub = this.sinon.stub().resolves({
      foo: 'bar',
      count: 2,
      url: 'https://localhost:8000',
      environment: 'local',
    });
    instance.onPopulateConfig(populateStub);

    const result = await instance.fetchConfig();
    this.assert.deepEqual(result, {
      environment: 'local',
      foo: 'bar',
      count: 2,
      url: 'https://localhost:8000',
    });
    this.assert.called(envStub);
    this.assert.called(populateStub);
  });
});
