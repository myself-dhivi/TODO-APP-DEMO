import { Response, NextFunction } from 'express';

export const ok = (res: Response, data: any, status: number = 200) => {
  return res.status(status).json({ data, error: null });
};

export const created = (res: Response, data: any) => {
  return res.status(201).json({ data, error: null });
};

export const badRequest = (next: NextFunction, message: string) => {
  const error: any = new Error(message);
  error.status = 400;
  return next(error);
};

export const unauthorized = (next: NextFunction, message: string = 'Unauthorized') => {
  const error: any = new Error(message);
  error.status = 401;
  return next(error);
};

export const notFound = (next: NextFunction, message: string = 'Resource not found') => {
  const error: any = new Error(message);
  error.status = 404;
  return next(error);
};

export const internalError = (next: NextFunction, message: string = 'Internal server error') => {
  const error: any = new Error(message);
  error.status = 500;
  return next(error);
};