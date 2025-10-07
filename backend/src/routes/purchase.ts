import { Router } from 'express';

const router = Router();

router.post('/', (req, res)=> { return res.send('Create purchase endpoint'); });
router.get('/', (req, res)=> { return res.send('Get all purchases endpoint'); });

export default router;
