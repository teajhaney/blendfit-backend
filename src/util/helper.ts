import type { Response } from 'express';
import { z } from 'zod';
import logger from './logger.ts';

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
    message: 'Internal server error',
  });
}
