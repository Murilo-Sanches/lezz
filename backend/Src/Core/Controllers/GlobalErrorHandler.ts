import { NextFunction, Request, Response } from 'express';

import Exception from '@Base/Utilities/Exception';

interface TypedError extends Error {
  statusCode: number;
  status: string;
  code: number;
}

class GlobalErrorHandler {
  public static Void(err: TypedError, req: Request, res: Response, next: NextFunction) {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
      GlobalErrorHandler.ErrorDevelopment(err, req, res);
    }

    if (process.env.NODE_ENV === 'production') {
      //
    }
  }

  private static ErrorDevelopment(err: TypedError, req: Request, res: Response) {
    if (req.originalUrl.startsWith('/api')) {
      return res.status(err.statusCode).json({
        status: err.statusCode,
        error: err,
        message: err.message,
        stack: err.stack,
      });
    }
  }

  private static ErrorProduction(err: TypedError, req: Request, res: Response) {
    if (req.originalUrl.startsWith('/api')) {
      return res.status(err.statusCode).json({
        status: err.statusCode,
        error: err,
        message: err.message,
        stack: err.stack,
      });
    }
  }

  private static DuplicatedKey() {
    return new Exception(`já existe`, 400);
  }
}

export default GlobalErrorHandler;
