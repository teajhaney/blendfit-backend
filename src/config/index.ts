import dotenv from 'dotenv';
dotenv.config();

export const redis_url = process.env.REDIS_URL;
export const PORT = process.env.PORT;
export const MONGODB_URL = process.env.MONGODB_URL;
export const NODE_ENV = process.env.NODE_ENV;

