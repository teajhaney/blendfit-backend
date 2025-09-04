import type { Response } from 'express';
import { z } from 'zod';
import logger from './logger.ts';
import { Redis } from 'ioredis';
import { redis_url } from '../config/index.ts';

const redisClient = new Redis(redis_url ?? 'redis://localhost:6379');

export function handleError(res: Response, error: unknown, context: string) {
  if (error instanceof z.ZodError) {
    // Zod validation error
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: error.issues,
    });
  }

  // Generic error
  logger.error(`${context} error occurred`, error);
  return res.status(500).json({
    success: false,
    message: `Internal server error: ${error}`,
  });
}

export const invalidatePostCache = async (input: string) => {
  const cachedKey = `products:${input}`;
  await redisClient.del(cachedKey);

  const keys = await redisClient.keys('products:*');
  keys.forEach(async key => {
    await redisClient.del(key);
  });
};
