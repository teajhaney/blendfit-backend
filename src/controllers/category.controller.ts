import type { Request, Response, NextFunction } from 'express';
import { handleError } from '../util/helper.ts';
import logger from '../util/logger.ts';
import { bulkCategorySchema, categorySchema } from '../util/validation.ts';
import Category from '../models/category.model.ts';

export const addCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info('Category endpoint hit....');

  try {
    const { categories } = bulkCategorySchema.parse(req.body);
    const category = await Category.insertMany(categories, { ordered: false });
    return res.status(201).json({
      success: true,
      message: 'Category succcessfully',
      length: categories.length,
      category,
    });
  } catch (error) {
    handleError(res, error, 'Add to category');
  }
};

export const fetchCategory = async (req: Request, res: Response) => {
  logger.info('fetch all category endpoint hit....');
  try {
    const categories = await Category.find({});
    if (categories.length === 0) {
      logger.error('No category ');
      return res.status(409).json({ message: 'No category available yet' });
    }

    logger.info('User fetched successfully');
    return res.status(201).json({
      success: true,
      message: 'User fetched succcessfully',
      length: categories.length,
      categories,
    });
  } catch (error) {
    handleError(res, error, 'Category fetch');
  }
};
