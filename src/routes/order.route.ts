import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.ts';

import { createOrder } from '../controllers/order.controller.ts';

const router = Router();

router.post('/', authMiddleware, createOrder);

export default router;
