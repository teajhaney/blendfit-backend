import logger from '../util/logger.ts';
import type { Request, Response } from 'express';
import { signupSchema } from '../util/validation.ts';
import { z } from 'zod';
import User from '../models/user.model.ts';

export const signup = async (req: Request, res: Response) => {
  logger.info('Sign up endpoint hit....');

  try {
    const { firstName, lastName, email, password } = signupSchema.parse(
      req.body
    );

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.error('Email already in use');
      return res.status(409).json({ message: 'Email already in use' });
    }

    const newUser = User.create({
      firstName,
      lastName,
      email,
      password,
    });

    logger.info('User registered successfully');
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      newUser,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors from Zod
      return res
        .status(400)
        .json({ message: 'Validation failed', errors: error.issues });
    }
    logger.error('Sign up error occured', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
