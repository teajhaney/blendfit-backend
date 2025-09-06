import type { Request, Response } from 'express';
import logger from '../util/logger.ts';
import { handleError, invalidateRedisCache } from '../util/helper.ts';
import { productSchema } from '../util/validation.ts';
import Product from '../models/product.model.ts';
import { Redis } from 'ioredis';
import { redis_url } from '../config/index.ts';
import Review from '../models/review.model.ts';
import Media from '../models/product.image.model.ts';
import { deleteMediaFromCloudinary } from '../util/claudinary.ts';

const redisClient = new Redis(redis_url ?? 'redis://localhost:6379');

export const createProduct = async (req: Request, res: Response) => {
  logger.info('Create post endpoint hit....');
  try {
    const { name, description, price, category, gender, brand, stock } =
      productSchema.parse(req.body);

    const newProduct = await Product.create({
      userId: req.user?.userId,
      name,
      description,
      price,
      category,
      stock,
      gender,
      brand,
    });

    //invalidate redis product
    await invalidateRedisCache(newProduct._id.toString());

    logger.info('Product created successfully', newProduct);
    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: newProduct,
    });
  } catch (error) {
    handleError(res, error, 'Create post');
  }
};

export const fetchAllProducts = async (req: Request, res: Response) => {
  try {
    const page = parseInt((req.query.page as string) ?? '1', 10);
    const limit = parseInt((req.query.limit as string) || '10', 10);
    const skip = (page - 1) * limit;

    const cachekey = `products:${page}:${limit}`;

    const cachedProducts = await redisClient.get(cachekey);
    if (cachedProducts) {
      return res.status(200).json({
        success: true,
        message: 'Posts fetched successfully',
        products: JSON.parse(cachedProducts),
      });
    }
    const totalProducts = await Product.countDocuments();

    const allProducts = await Product.find({})
      .skip(skip)
      .limit(limit)
      .sort({
        createdAt: -1,
      })
      .populate([
        { path: 'category', select: 'name', options: { _id: false } },
        { path: 'brand', select: 'name' },
        { path: 'gender', select: 'gender' },
        { path: 'images', select: 'url' },
        { path: 'reviews', select: 'comment rating' },
      ])
      .exec();

    if (!allProducts || allProducts.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No products available at this moment',
        products: {
          totalProducts,
          totalPages: Math.ceil(totalProducts / limit),
          currentPage: page,
          limit,
          allProducts: [],
        },
      });
    }

    const products = {
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      limit,
      allProducts,
    };

    //save product in redis client
    await redisClient.setex(cachekey, 300, JSON.stringify(products));

    logger.info('All product fetched successfully');
    return res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      products,
    });
  } catch (error) {
    handleError(res, error, 'Fetch products');
  }
};

export const fetchSingleProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const cachekey = `products:${productId}`;

    const cachedProduct = await redisClient.get(cachekey);

    if (cachedProduct) {
      return res.status(200).json({
        success: true,
        message: 'Product fetched successfully',
        product: JSON.parse(cachedProduct),
      });
    }

    const product = await Product.findById(productId)
      .populate([
        { path: 'category', select: 'name', options: { _id: false } },
        { path: 'brand', select: 'name' },
        { path: 'gender', select: 'gender' },
        { path: 'images', select: 'url' },
        { path: 'reviews', select: 'comment rating' },
      ])
      .exec();
    if (!product) {
      logger.warn('Product not found');
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    //save posts in redis client
    await redisClient.setex(cachekey, 3600, JSON.stringify(product));

    logger.info('Post fetched successfully');
    return res.status(200).json({
      success: true,
      message: 'Post fetched successfully',
      product,
    });
  } catch (error) {
    handleError(res, error, 'Fetch product');
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const data = productSchema.partial().parse(req.body);

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (product.userId.toString() !== req.user?.userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this product',
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: data },
      { new: true, runValidators: true }
    )
      .populate([
        { path: 'category', select: 'name', options: { _id: false } },
        { path: 'brand', select: 'name' },
        { path: 'gender', select: 'gender' },
        { path: 'images', select: 'url' },
        { path: 'reviews', select: 'comment rating' },
      ])
      .exec();

    //invalidate redis product
    await invalidateRedisCache(updatedProduct!._id.toString());

    logger.info('Product updated successfully');
    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      updatedProduct,
    });
  } catch (error) {
    handleError(res, error, 'update product');
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  logger.info('Delete product endpoint hit....');
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (product.userId.toString() !== req.user?.userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this product',
      });
    }

    const deletedProduct = await Product.findByIdAndDelete(productId);

    // Delete all reviews associated with this product
    await Review.deleteMany({ productId: deletedProduct!._id });

    // Delete all media associated with this product
    const medias = await Media.find({ productId: deletedProduct!._id });
    for (const media of medias) {
      await deleteMediaFromCloudinary(media.publicId);
    }
    await Media.deleteMany({ productId: deletedProduct!._id });

    //invalidate redis product
    await invalidateRedisCache(deletedProduct!._id.toString());

    logger.info('Product deleted successfully');
    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    handleError(res, error, 'delete product');
  }
};
