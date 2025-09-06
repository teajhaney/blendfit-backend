import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.ts';
import adminMiddleware from '../middlewares/admin.middleware.ts';
import multerMiddleware from '../middlewares/upload.middleware.ts';
import { uploadMedia } from '../controllers/media.controller.ts';

const router = Router();

router.post(
  '/media',
  authMiddleware,
  adminMiddleware,
  multerMiddleware.single('file'),
  uploadMedia
);

export default router;
