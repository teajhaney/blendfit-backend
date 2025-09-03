import mongoose from 'mongoose';
import logger from '../util/logger.ts';
import { MONGODB_URL } from '../config/index.ts';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URL as string);
    logger.info('Connected to MongoDB');
    console.log(`MongoDB server Connected`);
  } catch (error) {
    logger.error('Error connecting to MongoDB', error);
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error('Error:', error);
    }
    process.exit(1);
  }
};


export default connectDB;

