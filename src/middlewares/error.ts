import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  status?: number;
}

export const errorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = error.status || 500;
  const message = error.message || 'Internal server error';

  console.error(`[ERROR] ${status}: ${message}`);
  
  return res.status(status).json({
    data: null,
    error: message
  });
};