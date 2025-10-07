import { Router } from 'express';
import { validateBody } from '../middleware/validation';
import { purchaseValidation } from '../utils/validation';
import { purchaseController } from '../di/container'
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, validateBody(purchaseValidation.create), purchaseController.create);
router.get('/', authMiddleware, purchaseController.getAll);

export default router;
