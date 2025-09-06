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
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      {
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          logger.error('Error while uploading to cloudinary', error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    uploadStream.end(file.buffer);
  });
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
