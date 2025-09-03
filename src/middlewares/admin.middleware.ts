import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../util/logger.ts';
import { JWT_SECRET } from '../config/index.ts';

const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.user!.role !== 'admin') {
    return res.status(500).json({
      success: false,
      message: 'Access denied. You are not an admin',
    });
  }
  next();
};

export default adminMiddleware;
