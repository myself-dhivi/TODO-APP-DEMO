import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth';
import { validate, registerSchema, loginSchema } from '../middlewares/validate';

const router = Router();

// Public routes
router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);

// Protected routes
router.get('/me', authenticate, AuthController.getProfile);

export { router as authRoutes };