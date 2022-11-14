import { type SomeZodObject, z } from 'zod';

export type ConfigSchema = SomeZodObject;
export type EnvSchema = SomeZodObject;

export type EnvironmentConfigs<S extends ConfigSchema> = {
  local: z.infer<S>;
  development?: z.infer<S>;
  production?: z.infer<S>;
};
export type Environments = keyof EnvironmentConfigs<ConfigSchema>;

export const BaseEnvironmentConfig = z.object({
  environment: z.union([
    z.literal('local'),
    z.literal('development'),
    z.literal('production'),
  ]),
});

export type EnvironmentConfig<S extends ConfigSchema> = z.infer<S> &
  z.infer<typeof BaseEnvironmentConfig>;

export type RequestEnvFunc<E extends EnvSchema> = () => Promise<z.infer<E>>;
export type ConfigEnvPopulateFunc<
  S extends ConfigSchema,
  E extends EnvSchema
> = (partialConfig: z.infer<S>, envVars: z.infer<E>) => z.infer<S>;
