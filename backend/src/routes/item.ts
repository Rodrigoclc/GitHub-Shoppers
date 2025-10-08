import { Router } from 'express';
import { validateBody } from '../middleware/validation';
import { itemValidation } from '../utils/validation';
import { productController} from '../di/container'
import { authMiddleware } from '../middleware/auth';
import { requireAdmin } from '../middleware/authorization';

const router = Router();

router.post('/', authMiddleware, requireAdmin, validateBody(itemValidation.create), productController.create);
router.get('/', authMiddleware, productController.getAll);

export default router;
