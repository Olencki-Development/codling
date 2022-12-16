export class CodlingNetworkError extends Error {
  constructor(message: string, readonly response: Response) {
    super(message);
    Error.captureStackTrace(this, CodlingNetworkError);
  }
}
