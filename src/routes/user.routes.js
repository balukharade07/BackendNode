import { Router } from 'express';
import { registreUser } from '../controllers/user.controllers.js';

const router = Router();

router.route('/register').post(registreUser)

export default router;