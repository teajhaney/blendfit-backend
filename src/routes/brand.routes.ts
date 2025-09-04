import { Router } from 'express';
import {
  addBrand,fetchBrand
} from '../controllers/brand.controller.ts';

const router = Router();

router.post('/add-brand', addBrand);
router.get('/browse-brands', fetchBrand);

export default router;
