import cloudinary from 'cloudinary';

import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from '../config/index.ts';
import logger from './logger.ts';
import fs from 'fs';
cloudinary.v2.config({
  cloud_name: CLOUDINARY_CLOUD_NAME || '',
  api_key: CLOUDINARY_API_KEY || '',
  api_secret: CLOUDINARY_API_SECRET || '',
});

export const uploadMediaToCloudinary = async (file: Express.Multer.File) => {
  try {
    const result = await cloudinary.v2.uploader.upload(file.path);
    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error('error while uploadning to cloudinary', error);
  }
};

export const deleteMediaFromCloudinary = async (publicId: string) => {
  try {
    const result = await cloudinary.v2.uploader.destroy(publicId);
    logger.info('Media deleted from cloudinary', publicId);
    return result;
  } catch (error) {
    logger.error('Error while deleting media from cloudinary', error);
    throw error;
  }
};
