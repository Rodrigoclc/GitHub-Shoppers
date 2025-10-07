import { Router } from 'express';
import { authController } from '../di/container';
import { authMiddleware } from '../middleware/auth';
import { userValidation } from '../utils/validation'
import { validateBody } from '../middleware/validation';

const router = Router();

router.post('/register', validateBody(userValidation.create), authController.register);
router.post('/login', validateBody(userValidation.login), authController.login);

router.get('/profile', authMiddleware, authController.getProfile);
router.put('/change-password', authMiddleware, authController.changePassword);

export default router;
