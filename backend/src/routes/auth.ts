import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthService } from '../services/AuthService';
import { authMiddleware } from '../middleware/auth';
import { UserRepository } from '../repository/UserRepository';
import { userValidation } from '../utils/validation'
import { validateBody } from '../middleware/validation';

const router = Router();
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

router.post('/register', validateBody(userValidation.create), authController.register);
router.post('/login', validateBody(userValidation.login), authController.login);

router.get('/profile', authMiddleware, authController.getProfile);
router.put('/change-password', authMiddleware, authController.changePassword);

export default router;
