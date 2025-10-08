export class ApiError extends Error {
  public statusCode: number;
  public details?: any;

  constructor(statusCode: number, details?: any) {
    super(`API Error: ${statusCode}`);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, ApiError.prototype); // instanceof düzgün çalışsın
  }
}
