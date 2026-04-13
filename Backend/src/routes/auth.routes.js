import { Router } from 'express';

import authController from '../controller/auth.controller.js';
import { registerValidator, loginValidator } from '../validator/authValidator.js';
import { authenticate } from '../middleware/auth.middleware.js';


const authRouter = Router();

authRouter.post('/register', registerValidator, authController.register);

authRouter.get('/verify-email', authController.verifyEmail);

authRouter.post('/login', loginValidator, authController.login);

authRouter.get('/get-me', authenticate, authController.getMe);




export default authRouter;
