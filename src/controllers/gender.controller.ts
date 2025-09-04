import type { Request, Response, NextFunction } from 'express';
import { handleError } from '../util/helper.ts';
import logger from '../util/logger.ts';
import { genderSchema } from '../util/validation.ts';
import Gender from '../models/gender.model.ts';

export const addGender = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info('Gender endpoint hit....');

  try {
    const { gender } = genderSchema.parse(req.body);
    const genders = await Gender.create({gender});
    return res.status(201).json({
      success: true,
      message: 'Gender created succcessfully',
      genders,
    });
  } catch (error) {
    handleError(res, error, 'Add to gender');
  }
};
