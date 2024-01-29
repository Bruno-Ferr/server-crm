import express from 'express'
import { authController } from '../controllers/authentication';

const router = express.Router();

router.post('/signUp', authController.register);
router.post('/login', authController.login);


export default router;