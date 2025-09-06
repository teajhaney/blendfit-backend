import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.ts';
import adminMiddleware from '../middlewares/admin.middleware.ts';
import multerMiddleware from '../middlewares/upload.middleware.ts';
import { deleteMedia, uploadMedia } from '../controllers/media.controller.ts';

const router = Router();

router.post(
  '/uplaod',
  authMiddleware,
  adminMiddleware,
  multerMiddleware.single('image'),
  uploadMedia
);
router.delete(
  '/delete/:id',
  authMiddleware,
  adminMiddleware,
  deleteMedia
);


export default router;
