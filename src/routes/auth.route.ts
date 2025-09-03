import { Router } from 'express';
import { signup } from '../controllers/auth.controller.ts';


const router = Router();


router.post('/register', signup);

export default router;

