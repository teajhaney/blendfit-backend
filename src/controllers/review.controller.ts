import type { Request, Response } from 'express';
import logger from '../util/logger.ts';
import { handleError } from '../util/helper.ts';
import { reviewSchema } from '../util/validation.ts';
import Review from '../models/review.model.ts';
import Product from '../models/product.model.ts';

export const createReview = async (req: Request, res: Response) => {
  logger.info('Create review endpoint hit....');
  try {
    const { rating, comment, productId } = reviewSchema.parse(req.body);

    const review = await Review.create({
      userId: req.user?.userId,
      rating,
      comment,
      productId,
    });

    logger.info('Review created successfully');
    return res.status(201).json({
      success: true,
      message: 'Review created successfully',
      review: review,
    });
  } catch (error) {
    handleError(res, error, 'Write review');
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const reviewId = req.params.id;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    if (review.userId.toString() !== req.user?.userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this review',
      });
    }

    await Review.findByIdAndDelete(reviewId);

    logger.info('Review deleted successfully');
    return res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    handleError(res, error, 'delete review');
  }
};

export const fetchReviewsByProductId = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const reviews = await Review.find({ productId }).populate('productId');

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No reviews found for this product',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Review fetched successfully',
      length: reviews.length,
      reviews,
    });
  } catch (error) {
    handleError(res, error, 'fetch reviews by product');
  }
};
