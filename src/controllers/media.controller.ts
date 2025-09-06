import Media from '../models/product.image.model.ts';
import Product from '../models/product.model.ts';
import type { CloudinaryUploadResult } from '../types/index.ts';
import {
  deleteMediaFromCloudinary,
  uploadMediaToCloudinary,
} from '../util/claudinary.ts';
import { handleError, invalidateRedisCache } from '../util/helper.ts';
import logger from '../util/logger.ts';
import type { Request, Response } from 'express';
import fs from 'fs';

export const uploadMedia = async (req: Request, res: Response) => {
  logger.info('Starting media upload..');
  try {
    //check if file is available in req
    if (!req.file) {
      logger.error('No file uploaded, add a file and try again!!');
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please upload an image.',
      });
    }

    const userId = req.user?.userId;

    // logger.info(`File details: ${originalname}, ${mimetype}`);
    logger.info('uploading file to cloudinary...');

    const { secure_url, public_id } = (await uploadMediaToCloudinary(
      req.file
    )) as CloudinaryUploadResult;

    // Add validation if needed
    if (!secure_url || !public_id) {
      throw new Error(
        'Cloudinary upload failed - no URL or public ID returned'
      );
    }

    const { productId } = req.body;
    logger.info(`cloudinary upload successful , public id: - ${public_id}`);

    const uploadedMedia = await Media.create({
      url: secure_url,
      publicId: public_id,
      productId,
      userId: userId,
    });

    await invalidateRedisCache(productId);

    logger.info('Media uploaded to  to database');

    await Product.findByIdAndUpdate(
      productId,
      { $push: { images: uploadedMedia._id } },
      { new: true, runValidators: true }
    );

    fs.unlinkSync(req.file.path);
    res.status(201).json({
      success: true,
      message: 'Media uploaded successfully',
      data: uploadedMedia,
    });
  } catch (error) {
    handleError(res, error, 'Uplaod media');
  }
};

export const getAllMedia = async (req: Request, res: Response) => {
  try {
    const medias = await Media.find({});
    const count = await Media.countDocuments();
    logger.info('Media fetched successfully', medias);
    res.status(200).json({
      success: true,
      message: 'Media fetched successfully',
      length: count,
      data: medias,
    });
  } catch (error) {
    handleError(res, error, 'fetching media');
  }
};

export const deleteMedia = async (req: Request, res: Response) => {
  logger.info('Delete media endpoint hit...');
  try {
    const mediaId = req.params.id;
    const mediaToDelete = await Media.findById(mediaId);

    if (!mediaToDelete) {
      return res.status(404).json({
        success: false,
        message: 'Media not found',
      });
    }

    if (mediaToDelete.userId.toString() !== req.user?.userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this media',
      });
    }

    await deleteMediaFromCloudinary(mediaToDelete.publicId);
    await Media.findByIdAndDelete(mediaToDelete._id);

    await invalidateRedisCache(mediaToDelete.productId.toString());

    logger.info('Media deleted successfully');
    res.status(200).json({
      success: true,
      message: 'Media deleted successfully',
    });
  } catch (error) {
    handleError(res, error, 'Deleting media');
  }
};
