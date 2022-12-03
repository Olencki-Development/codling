import { type SomeZodObject, z } from 'zod';
export type ConfigSchema = SomeZodObject;
export type EnvSchema = SomeZodObject;
export type EnvironmentConfigs<S extends ConfigSchema> = {
  local: z.infer<S>;
  development?: z.infer<S>;
  production?: z.infer<S>;
};
export type Environments = keyof EnvironmentConfigs<ConfigSchema>;
export declare const BaseEnvironmentConfig: z.ZodObject<
  {
    environment: z.ZodUnion<
      [
        z.ZodLiteral<'local'>,
        z.ZodLiteral<'development'>,
        z.ZodLiteral<'production'>
      ]
    >;
  },
  'strip',
  z.ZodTypeAny,
  {
    environment: 'local' | 'development' | 'production';
  },
  {
    environment: 'local' | 'development' | 'production';
  }
>;
export type EnvironmentConfig<S extends ConfigSchema> = z.infer<S> &
  z.infer<typeof BaseEnvironmentConfig>;
export type RequestEnvFunc<E extends EnvSchema> = () => Promise<z.infer<E>>;
export type ConfigEnvPopulateFunc<
  S extends ConfigSchema,
  E extends EnvSchema
> = (
  partialConfig: EnvironmentConfig<S>,
  envVars: z.infer<E>
) => EnvironmentConfig<S>;
