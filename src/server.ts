import express from 'express';

import { PORT, redis_url } from './config/index.ts';
import connectDB from './database/db.ts';

import { RateLimiterRedis } from 'rate-limiter-flexible';
import { Redis } from 'ioredis';
import helmet from 'helmet';
import cors from 'cors';
import errorHandler from './middlewares/errorHandler.ts';
import logger from './util/logger.ts';
import authRoutes from './routes/auth.route.ts';
import userRoutes from './routes/user.route.ts';
import categoryRoutes from './routes/category.route.ts';
import brandRoutes from './routes/brand.routes.ts';
import genderRoutes from './routes/gender.route.ts';
import productRoutes from './routes/product.route.ts';
import reviewRoutes from './routes/review.route.ts';
import cartRoutes from './routes/cart.routes.ts';
import mediaRoutes from './routes/media.route.ts';
import orderRoutes from './routes/order.route.ts';
const app = express();

const redisClient = new Redis(redis_url ?? 'redis://localhost:6379');

connectDB();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`Received : ${req.method} ${req.url}`);
  logger.info(`Request body : ${req.body}`);
  next();
});

//DDos protection and rate limiter

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'middleware',
  points: 50,
  duration: 10,
});

app.use((req, res, next) => {
  rateLimiter
    .consume(req.ip || 'unknown')
    .then(() => {
      next();
    })
    .catch(() => {
      logger.error(`Rate limit exceeded for IP: ${req.ip}`);
      res.status(429).json({
        success: false,
        message: 'Too many requests',
      });
    });
});

//routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/products', categoryRoutes);
app.use('/api/products', brandRoutes);
app.use('/api/products', genderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/products', reviewRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/order', orderRoutes);

//error handler middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
