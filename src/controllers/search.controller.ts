// import type { Request, Response } from 'express';
// import Product from '../models/product.model.ts';
// import { handleError, invalidateRedisCache } from '../util/helper.ts';
// import logger from '../util/logger.ts';
// import { Redis } from 'ioredis';
// import { redis_url } from '../config/index.ts';
// import Category from '../models/category.model.ts';
// import Brand from '../models/brand.model.ts';
// import Gender from '../models/gender.model.ts';

// const redisClient = new Redis(redis_url ?? 'redis://localhost:6379');

// export const searchProducts = async (req: Request, res: Response) => {
//   logger.info('Search endpoint hit....');
//   try {
//     const { name, minPrice, maxPrice, category, brand, gender } = req.query;

//     const filter: any = {};
//     const cachedSearchKey = `search:${JSON.stringify(req.query)}`;

//     const cachedSearchResults = await redisClient.get(cachedSearchKey);

//     logger.info('Products search successful');

//     if (cachedSearchResults) {
//       res.json({
//         success: true,
//         message: 'Products search successful',
//         products: JSON.parse(cachedSearchResults),
//       });
//     }

//     if (name) {
//       filter.name = { $regex: name as string, $options: 'i' };
//     }

//     if (minPrice || maxPrice) {
//       filter.price = {};
//       if (minPrice) {
//         filter.price.$gte = Number(minPrice);
//       }
//       if (maxPrice) {
//         filter.price.$lte = Number(maxPrice);
//       }
//     }
//     if (category) {
//       const products = await Category.find({
//         name: { $regex: category as string, $options: 'i' },
//       });
//       logger.info('Products search successful');
//       return res.json({
//         success: true,
//         message: 'Products search successful',
//         length: products.length,
//         products,
//       });
//     }

//     if (brand) {
//       const products = await Brand.find({
//         name: { $regex: brand as string, $options: 'i' },
//       });
//       logger.info('Products search successful');
//       return res.json({
//         success: true,
//         message: 'Products search successful',
//         length: products.length,
//         products,
//       });
//     }

//     if (gender) {
//       const products = await Gender.find({
//         gender: gender,
//       });
//       logger.info('Products search successful');
//       return res.json({
//         success: true,
//         message: 'Products search successful',
//         length: products.length,
//         products,
//       });
//     }

//     const products = await Product.find(filter).populate([
//       'category',
//       'brand',
//       'gender',
//     ]);

//     if (products.length === 0) {
//       logger.info('No product found');
//       res.json({
//         success: true,
//         message: 'No product found',
//       });
//     }

//     await invalidateRedisCache(cachedSearchKey);
//     await redisClient.setex(cachedSearchKey, 300, JSON.stringify(products));
//     logger.info('Products search successful');
//     res.json({
//       success: true,
//       message: 'Products search successful',
//       length: products.length,
//       products,
//     });
//   } catch (error) {
//     handleError(res, error, 'Search product ');
//   }
// };

import type { Request, Response } from 'express';
import Product from '../models/product.model.ts';
import { handleError, invalidateRedisCache } from '../util/helper.ts';
import logger from '../util/logger.ts';
import { Redis } from 'ioredis';
import { redis_url } from '../config/index.ts';
import Category from '../models/category.model.ts';
import Brand from '../models/brand.model.ts';
import Gender from '../models/gender.model.ts';

const redisClient = new Redis(redis_url ?? 'redis://localhost:6379');

export const searchProducts = async (req: Request, res: Response) => {
  logger.info('Search endpoint hit...');
  try {
    const { name, minPrice, maxPrice, category, brand, gender } = req.query;

    // Generate a unique cache key based on query parameters
    const cachedSearchKey = `search:${JSON.stringify(req.query)}`;

    // Check for cached results
    const cachedSearchResults = await redisClient.get(cachedSearchKey);
    if (cachedSearchResults) {
      logger.info('Returning cached search results');
      return res.json({
        success: true,
        message: 'Products search successful',
        products: JSON.parse(cachedSearchResults),
      });
    }

    // Build the filter object for MongoDB query
    const filter: any = {};
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

    // Handle category, brand, and gender by fetching their IDs
    if (category) {
      const categoryDocs = await Category.find({
        name: { $regex: category as string, $options: 'i' },
      }).select('_id');
      if (categoryDocs.length === 0) {
        logger.info('No categories found for the provided query');
        return res.json({
          success: true,
          message: 'No products found for the provided category',
          products: [],
        });
      }
      filter.category = { $in: categoryDocs.map(doc => doc._id) };
    }

    if (brand) {
      const brandDocs = await Brand.find({
        name: { $regex: brand as string, $options: 'i' },
      }).select('_id');
      if (brandDocs.length === 0) {
        logger.info('No brands found for the provided query');
        return res.json({
          success: true,
          message: 'No products found for the provided brand',
          products: [],
        });
      }
      filter.brand = { $in: brandDocs.map(doc => doc._id) };
    }

    if (gender) {
      const genderDocs = await Gender.find({
        gender: { $regex: gender as string, $options: 'i' },
      }).select('_id');
      if (genderDocs.length === 0) {
        logger.info('No genders found for the provided query');
        return res.json({
          success: true,
          message: 'No products found for the provided gender',
          products: [],
        });
      }
      filter.gender = { $in: genderDocs.map(doc => doc._id) };
    }

    // Query products with the constructed filter
    const products = await Product.find(filter).populate([
      { path: 'category', select: 'name' },
      { path: 'brand', select: 'name' },
      { path: 'gender', select: 'gender' },
    ]);

    if (products.length === 0) {
      logger.info('No products found');
      return res.json({
        success: true,
        message: 'No products found',
        products: [],
      });
    }

    // Cache the results
    await redisClient.setex(cachedSearchKey, 300, JSON.stringify(products));
    logger.info('Products search successful, cached results');

    return res.json({
      success: true,
      message: 'Products search successful',
      length: products.length,
      products,
    });
  } catch (error) {
    handleError(res, error, 'Search product');
  }
};
