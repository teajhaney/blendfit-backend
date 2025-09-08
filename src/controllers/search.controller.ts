import type { Request, Response } from 'express';
import Product from '../models/product.model.ts';
import { handleError, invalidateRedisCache } from '../util/helper.ts';
import logger from '../util/logger.ts';
import { Redis } from 'ioredis';
import { redis_url } from '../config/index.ts';

const redisClient = new Redis(redis_url ?? 'redis://localhost:6379');

export const searchProducts = async (req: Request, res: Response) => {
  logger.info('Search endpoint hit....');
  try {
    const { name, minPrice, maxPrice, category, brand, gender } = req.query;

    const filter: any = {};
    const cachedSearchKey = `search:${JSON.stringify(req.query)}`;

    const cachedSearchResults = await redisClient.get(cachedSearchKey);

    logger.info('Products search successful');

    if (cachedSearchResults) {
      res.json({
        success: true,
        message: 'Products search successful',
        products: JSON.parse(cachedSearchResults),
      });
    }

    if (name) {
      filter.name = { $regex: name as string, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }
      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    if (category) {
      filter.category = category;
    }

    if (brand) {
      filter.brand = brand;
    }

    if (gender) {
      filter.gender = gender;
    }

    const products = await Product.find(filter).populate([
      'category',
      'brand',
      'gender',
    ]);
    await invalidateRedisCache(cachedSearchKey);
    await redisClient.setex(cachedSearchKey, 300, JSON.stringify(products));
    logger.info('Products search successful');
    res.json({
      success: true,
      message: 'Products search successful',
      products,
    });
  } catch (error) {
    handleError(res, error, 'Search product ');
  }
};
