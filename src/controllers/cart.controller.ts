import type { Request, Response } from 'express';
import logger from '../util/logger.ts';
import { handleError, invalidateRedisCache } from '../util/helper.ts';
import { cartSchema } from '../util/validation.ts';
import Cart from '../models/cart.model.ts';
import { Redis } from 'ioredis';
import { redis_url } from '../config/index.ts';

const redisClient = new Redis(redis_url ?? 'redis://localhost:6379');

export const addToCart = async (req: Request, res: Response) => {
  logger.info('add to cart endpoint hit....');
  try {
    const { quantity, productId } = cartSchema.parse(req.body);

    const cart = await Cart.create({
      userId: req.user?.userId,
      quantity,
      productId,
    });

    logger.info('cart created successfully');
    return res.status(201).json({
      success: true,
      message: 'Product added to cart successfully',
      review: cart,
    });
  } catch (error) {
    handleError(res, error, 'Add to cart');
  }
};

export const fetchCartsByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const cachekey = `cart:${userId}`;
    const cachedCarts = await redisClient.get(cachekey);
    if (cachedCarts) {
      return res.status(200).json({
        success: true,
        message: 'Cart fetched successfully',
        length: JSON.parse(cachedCarts).length,
        carts: JSON.parse(cachedCarts),
      });
    }

    const carts = await Cart.find({ userId }).populate('productId');

    if (!carts || carts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No cart found for this user',
      });
    }

    //save reviews to redis
    await redisClient.setex(cachekey, 300, JSON.stringify(carts));

    logger.info('Review fetched successfully');
    return res.status(200).json({
      success: true,
      message: 'Cart fetched successfully',
      length: carts.length,
      carts,
    });
  } catch (error) {
    handleError(res, error, 'fetch cart by product');
  }
};

export const deleteCartItem = async (req: Request, res: Response) => {
  try {
    const cartItemId = req.params.id;

    const cart = await Cart.findById(cartItemId);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    if (cart.userId.toString() !== req.user?.userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this cart',
      });
    }

    await Cart.findByIdAndDelete(cartItemId);
    invalidateRedisCache(req.user?.userId);
    logger.info('Cart deleted successfully');
    return res.status(200).json({
      success: true,
      message: 'Cart deleted successfully',
    });
  } catch (error) {
    handleError(res, error, 'delete review');
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const cartItemId = req.params.id;
    const data = cartSchema.partial().parse(req.body);

    const cart = await Cart.findById(cartItemId);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found',
      });
    }

    if (cart.userId.toString() !== req.user?.userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this cart',
      });
    }

    const updatedCart = await Cart.findByIdAndUpdate(
      cartItemId,
      { $set: data },
      { new: true, runValidators: true }
    );

    await invalidateRedisCache(req.user?.userId);

    logger.info('Cart item updated successfully');
    return res.status(200).json({
      success: true,
      message: 'Cart item updated successfully',
      updatedCart,
    });
  } catch (error) {
    handleError(res, error, 'update cart item');
  }
};
