export type Pathname = string;

/**
 * Remove a leading "/" from a string
 * @example
 * type Result = RemoveLeadingSlash<"/users">
 * //     ^=  "users"
 */
type RemoveLeadingSlash<T_Pathname extends Pathname> =
  T_Pathname extends `/${infer T_RestPathname}` ? T_RestPathname : T_Pathname;

/**
 * Remove a trailing "/" from a string
 * @example
 * type Result = RemoveTrailingSlash<"users/">
 * //     ^?  "users"
 */
type RemoveTailingSlash<T_Pathname extends Pathname> =
  T_Pathname extends `${infer T_RestPathname}/` ? T_RestPathname : T_Pathname;

/**
 * Omit keys from object whose values is never
 */
type OmitNeverValues<T extends Record<string, unknown>> = {
  [key in keyof T as T[key] extends never ? never : key]: T[key];
};

/**
 * Parse a string to an object based on ":" character in the string
 * @example
 * type Result = ParseParamString<":userId">
 * //    ^? { userId: string }
 *
 * @example
 * type Result = ParseParamString<"/users">
 * //     ^? Record<string, never>
 */
type ParseParamString<T_Pathname extends Pathname> =
  T_Pathname extends `:${infer T_Param}`
    ? {
        [key in T_Param]: string;
      }
    : Record<string, never>;

/**
 * Parse a path string into params
 *
 * @example
 * type Result = ParsePathname<"users/:userId">
 * //     ^= { userId: string }
 *
 * @example
 * type Result = ParsePathname<"applications/:applicationId/questions/:questionId">
 * //     ^= { applicationId: string, questionId: string }
 *
 * @example
 * type Result = ParsePathname<"applications/responses">
 * //     ^= { }
 */
type ParsePathname<
  T_Pathname extends Pathname,
  T_Params extends { [param: string]: string } = Record<string, never>
> = T_Pathname extends `${infer T_LeadingPathname}/${infer T_TrailingPathname}`
  ? ParsePathname<
      T_TrailingPathname,
      T_Params & ParseParamString<T_LeadingPathname>
    >
  : T_Params & ParseParamString<T_Pathname>;

/**
 * Parse a path string into params
 *
 * @example
 * type Result = ParsePathname<"/users/:userId">
 * //     ^= { userId: string }
 *
 * @example
 * type Result = ParsePathname<"/applications/:applicationId/questions/:questionId/">
 * //     ^= { applicationId: string, questionId: string }
 *
 * @example
 * type Result = ParsePathname<"/applications/responses">
 * //     ^= { }
 */
export type InferPathnameParams<T extends Pathname> = OmitNeverValues<
  ParsePathname<RemoveTailingSlash<RemoveLeadingSlash<T>>>
> extends Record<string, never>
  ? Record<string, never>
  : OmitNeverValues<ParsePathname<RemoveTailingSlash<RemoveLeadingSlash<T>>>>;
