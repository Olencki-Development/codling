export declare class CodlingNetworkError extends Error {
  readonly response: Response;
  constructor(message: string, response: Response);
}
