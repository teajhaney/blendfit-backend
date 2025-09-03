import logger from '../util/logger.ts';
import type { Request, Response } from 'express';
import User from '../models/user.model.ts';

export const fetchUsers = async (req: Request, res: Response) => {
  logger.info('fetch all user endpoint hit....');
  try {
    const user = await User.find({});
    if (user.length === 0) {
      logger.error('No user');
      return res.status(409).json({ message: 'No user available' });
    }
    // remove password for each user
    const usersWithoutPassword = user.map(user => {
      const { password, ...rest } = user.toObject();
      return rest;
    });
    logger.info('User fetched successfully');
    return res.status(201).json({
      success: true,
      message: 'User fetched succcessfully',
      length: usersWithoutPassword.length,
      user: usersWithoutPassword,
    });
  } catch (error) {
    logger.error('user fetch error occured', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
