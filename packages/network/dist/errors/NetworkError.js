export class CodlingNetworkError extends Error {
  constructor(message, response) {
    super(message);
    this.response = response;
    Error.captureStackTrace(this, CodlingNetworkError);
  }
}
