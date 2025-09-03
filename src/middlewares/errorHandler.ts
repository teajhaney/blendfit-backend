import logger from '../util/logger.ts';
import { type Request, type Response, type NextFunction } from 'express';

interface CustomError extends Error {
  status?: number;
  stack?: string;
}

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err.stack);
  res
    .status(err.status || 500)
    .json({ message: err.message || 'Internal Server Error' });
};

export default errorHandler;
