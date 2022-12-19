/**
 * Response type when safeProcessRequest is successful
 */
export type SafeProcessRequestSuccess<T = Response> = {
  success: true;
  data: T;
};

/**
 * Response type when safeProcessRequest fails
 */
export type SafeProcessRequestError = {
  success: false;
  error: Error;
};

export type SafeProcessRequestReturnType<T> =
  | SafeProcessRequestSuccess<T>
  | SafeProcessRequestError;
