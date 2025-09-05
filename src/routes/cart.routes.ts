import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.ts';
import { addToCart, deleteCartItem, fetchCartsByUser, updateCartItem } from '../controllers/cart.controller.ts';

const router = Router();

router.get('/', authMiddleware, fetchCartsByUser);
router.post('/', authMiddleware, addToCart);
router.delete('/:id', authMiddleware, deleteCartItem);
router.put('/:id', authMiddleware, updateCartItem);


export default router;
