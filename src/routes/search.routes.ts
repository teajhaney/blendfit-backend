import { Router } from 'express';
import { searchProducts } from '../controllers/search.controller.ts';


const router = Router();

router.get('/', searchProducts);

export default router;
