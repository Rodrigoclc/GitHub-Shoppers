import { Router } from 'express';
import { validateBody } from '../middleware/validation';
import { itemValidation } from '../utils/validation';
import { productController} from '../di/container'

const router = Router();

router.post('/', validateBody(itemValidation.create), productController.create);
router.get('/', productController.getAll);

export default router;
