import { Request, Response, NextFunction } from 'express';

export interface AppError {
  status: number;
  title: string;
  detail: string;
}

// RFC 7807 форматаар алдаа буцаана
export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(err.status || 500).json({
    type: 'about:blank',
    title: err.title || 'Internal Server Error',
    status: err.status || 500,
    detail: err.detail || 'An unexpected error occurred'
  });
};

export const createError = (status: number, title: string, detail: string): AppError => ({
  status,
  title,
  detail
});