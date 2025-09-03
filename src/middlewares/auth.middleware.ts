import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../util/logger.ts';
import { JWT_SECRET } from '../config/index.ts';
import type { TokenPayload } from '../types/index.ts';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  logger.info('Auth middleware endpoint hit....');
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    logger.warn('token not available');
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided. Please login to continue',
    });
  }

  if (!JWT_SECRET) {
    logger.error('JWT_SECRET not set');
    return res.status(500).json({
      success: false,
      message: 'Internal server error: JWT_SECRET missing',
    });
  }

  //decode token

  try {
    const decodeToken = jwt.verify(token, JWT_SECRET) as TokenPayload;
    req.user = decodeToken;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Access denied. No token provided. Please login to continue',
    });
  }
};

export default authMiddleware;
