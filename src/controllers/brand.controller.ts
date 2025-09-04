import type { Request, Response, NextFunction } from 'express';
import { handleError } from '../util/helper.ts';
import logger from '../util/logger.ts';
import { brandSchema, bulkBrandSchema } from '../util/validation.ts';
import Brand from '../models/brand.model.ts';

export const addBrand = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info('Category endpoint hit....');

  try {
    const { brands } = bulkBrandSchema.parse(req.body);
    const { name } = brandSchema.parse(req.body);

    const brand = await Brand.insertMany(brands, { ordered: false });
    return res.status(201).json({
      success: true,
      message: 'Brand created succcessfully',
      length: brand.length,
      brand,
    });
  } catch (error) {
    handleError(res, error, 'Add to category');
  }
};

export const fetchBrand = async (req: Request, res: Response) => {
  logger.info('fetch all brand endpoint hit....');
  try {
    const brands = await Brand.find({});
    if (brands.length === 0) {
      logger.error('No brand available ');
      return res.status(409).json({ message: 'No bran available yet' });
    }

    logger.info('User fetched successfully');
    return res.status(201).json({
      success: true,
      message: 'User fetched succcessfully',
      length: brands.length,
      brands,
    });
  } catch (error) {
    handleError(res, error, 'Brand fetch');
  }
};
