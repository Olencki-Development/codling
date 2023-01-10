import type { Pathname } from './pathname.types.js';
import {
  RequestDef,
  RequestExecuteDef,
  RequestExecuteOptions,
  RequestMethod,
  EmptyZodObject,
  GetParamInput,
  GetQueryInput,
  GetBodyInput,
} from './request.types.js';
import { z } from 'zod';
export declare class RequestType<
  T_Method extends RequestMethod,
  T_Pathname extends Pathname,
  T_Query extends z.SomeZodObject = typeof EmptyZodObject,
  T_Body extends z.ZodTypeAny = z.ZodUnknown,
  T_Response extends z.ZodTypeAny = z.ZodUnknown
> {
  readonly method: T_Method;
  readonly pathname: T_Pathname;
  readonly querySchema: T_Query;
  readonly bodySchema: T_Body;
  readonly responseSchema: T_Response;
  get requestSchema(): z.ZodObject<
    {
      method: z.ZodEnum<['GET', 'POST', 'PATCH', 'DELETE']>;
      pathname: z.ZodString;
      params: z.ZodRecord<z.ZodString, z.ZodString>;
      query: T_Query;
      body: T_Body;
    },
    'strip',
    z.ZodTypeAny,
    z.objectUtil.addQuestionMarks<{
      method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
      pathname: string;
      params: Record<string, string>;
      query: T_Query['_output'];
      body: T_Body['_output'];
    }> extends infer T
      ? {
          [k_1 in keyof T]: z.objectUtil.addQuestionMarks<{
            method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
            pathname: string;
            params: Record<string, string>;
            query: T_Query['_output'];
            body: T_Body['_output'];
          }>[k_1];
        }
      : never,
    z.objectUtil.addQuestionMarks<{
      method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
      pathname: string;
      params: Record<string, string>;
      query: T_Query['_input'];
      body: T_Body['_input'];
    }> extends infer T_1
      ? {
          [k_3 in keyof T_1]: z.objectUtil.addQuestionMarks<{
            method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
            pathname: string;
            params: Record<string, string>;
            query: T_Query['_input'];
            body: T_Body['_input'];
          }>[k_3];
        }
      : never
  >;
  constructor(
    def: RequestDef<T_Method, T_Pathname, T_Query, T_Body, T_Response>
  );
  query<T_NewQuery extends z.SomeZodObject>(
    query: T_NewQuery
  ): RequestType<T_Method, T_Pathname, T_NewQuery, T_Body, T_Response>;
  body<T_NewBody extends z.ZodTypeAny>(
    body: T_NewBody
  ): RequestType<T_Method, T_Pathname, T_Query, T_NewBody, T_Response>;
  response<T_NewResponse extends z.ZodTypeAny>(
    response: T_NewResponse
  ): RequestType<T_Method, T_Pathname, T_Query, T_Body, T_NewResponse>;
  execute(
    def: RequestExecuteDef<T_Pathname, T_Query, T_Body>,
    options: RequestExecuteOptions
  ): Promise<z.output<T_Response>>;
  protected _getFormattedUrl(params?: GetParamInput<T_Pathname>): Pathname;
  protected _getFormattedQuery(query?: GetQueryInput<T_Query>): string;
  protected _getFormattedBody(
    body: GetBodyInput<T_Body>,
    isJSON?: boolean
  ): string;
}
