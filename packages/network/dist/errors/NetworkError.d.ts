/**
 * The primary error for this package.
 *
 * When a request fails in most respects, {@link CodlingNetworkError} is wrapped around the original error and provides additional context.
 *
 * @property response {@link Response} an access point to the internal fetch response
 */
export declare class CodlingNetworkError extends Error {
  readonly response: Response;
  constructor(message: string, response: Response);
}
