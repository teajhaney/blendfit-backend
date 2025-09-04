import { Router } from 'express';
import {
  addCategory,
  fetchCategory,
} from '../controllers/category.controller.ts';

const router = Router();

router.post('/add-category', addCategory);
router.get('/browse-categories', fetchCategory);

export default router;
