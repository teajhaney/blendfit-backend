import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.ts';
import adminMiddleware from '../middlewares/admin.middleware.ts';
import { fetchUsers } from '../controllers/user.controller.ts';

const router = Router();

router.get('/users', authMiddleware, adminMiddleware, fetchUsers);

export default router;
