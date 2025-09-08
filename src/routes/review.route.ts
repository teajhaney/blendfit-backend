import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.ts';

import {
  createReview,
  deleteReview,
  fetchReviewsByProductId,
} from '../controllers/review.controller.ts';

const router = Router();

router.post('/review', authMiddleware, createReview);
router.delete('/review/:id', authMiddleware, deleteReview);
router.get('/review/:id', authMiddleware, fetchReviewsByProductId);

export default router;
