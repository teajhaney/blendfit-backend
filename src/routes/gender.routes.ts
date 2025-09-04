import { Router } from 'express';
import { addGender } from '../controllers/gender.controller.ts';

const router = Router();

router.post('/add-gender', addGender);

export default router;
