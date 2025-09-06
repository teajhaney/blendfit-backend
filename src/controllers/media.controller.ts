import Media from '../models/product.image.model.ts';
import Product from '../models/product.model.ts';
import type { CloudinaryUploadResult } from '../types/index.ts';
import {
  deleteMediaFromCloudinary,
  uploadMediaToCloudinary,
} from '../util/claudinary.ts';
import { handleError } from '../util/helper.ts';
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

    // Add detailed file debugging
    console.log('File details:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      filename: req.file.filename,
    });

    // Check if file exists and has content
    if (!fs.existsSync(req.file.path)) {
      logger.error('File does not exist at path:', req.file.path);
      return res.status(400).json({
        success: false,
        message: 'File upload failed - file not found.',
      });
    }

    const fileStats = fs.statSync(req.file.path);
    console.log('File stats:', { size: fileStats.size });

    if (fileStats.size === 0) {
      logger.error('File is empty');
      return res.status(400).json({
        success: false,
        message: 'File is empty.',
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
      user: userId,
    });

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
  try {
    const mediaId = req.params.id;
    const mediaToDelete = await Media.find({ _id: { $in: mediaId } });

    for (const media of mediaToDelete) {
      await deleteMediaFromCloudinary(media.publicId);
      await Media.findByIdAndDelete(media._id);
    }
    logger.info('Media deleted successfully');
    res.status(200).json({
      success: true,
      message: 'Media fetched successfully',
    });
  } catch (error) {
    handleError(res, error, 'Deleting media');
  }
};
