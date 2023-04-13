class Exception extends Error {
  private readonly status: string;
  private readonly statusCode: number;
  private readonly isOperacional: boolean;

  public constructor(message: string, statusCode: number) {
    super(message);
    this.status = statusCode.toString().startsWith('4') ? 'fail' : 'error';
    this.statusCode = statusCode;
    this.isOperacional = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default Exception;
