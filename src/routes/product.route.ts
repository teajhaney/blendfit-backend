import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  fetchAllProducts,
  fetchSingleProduct,
  updateProduct,
} from '../controllers/product.controller.ts';
import authMiddleware from '../middlewares/auth.middleware.ts';
import adminMiddleware from '../middlewares/admin.middleware.ts';

const router = Router();

router.post('/', authMiddleware, adminMiddleware, createProduct);
router.get('/', fetchAllProducts);
router.get('/:id', fetchSingleProduct);
router.put('/:id', authMiddleware, adminMiddleware, updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);

export default router;
