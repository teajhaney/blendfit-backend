import logger from '../util/logger.ts';
import type { Request, Response } from 'express';
import { signinSchema, signupSchema } from '../util/validation.ts';
import { z } from 'zod';
import User from '../models/user.model.ts';
import generateToken from '../util/generate-token.ts';

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

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    const { password: _, ...userWithoutPassword } = newUser.toObject();
    logger.info('User registered successfully');
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: userWithoutPassword,
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

export const signin = async (req: Request, res: Response) => {
  logger.info('Sign in endpoint hit....');

  try {
    const { email, password } = signinSchema.parse(req.body);

    const user = await User.findOne({ email });
    if (!user) {
      logger.error('User not found');
      return res.status(409).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await user!.comparePassword(password);

    if (!isPasswordValid) {
      logger.warn('User not found');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    logger.info('User logged in successfully', user!._id);
    const accessToken = await generateToken(user);
    return res.status(201).json({
      success: true,
      message: 'User logged in succcessfully',
      accessToken,
      userId: user!._id,
      role: user!.role,
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
