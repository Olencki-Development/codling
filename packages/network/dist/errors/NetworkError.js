/**
 * The primary error for this package.
 *
 * When a request fails in most respects, {@link CodlingNetworkError} is wrapped around the original error and provides additional context.
 *
 * @property response {@link Response} an access point to the internal fetch response
 */
export class CodlingNetworkError extends Error {
  constructor(message, response) {
    super(message);
    this.response = response;
    Error.captureStackTrace(this, CodlingNetworkError);
  }
}
