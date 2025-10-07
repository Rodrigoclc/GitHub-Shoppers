import { Router } from 'express';

const router = Router();

router.post('/', (req, res)=> { return res.send('Create item endpoint'); });
router.get('/', (req, res)=> { return res.send('Get all items endpoint'); });

export default router;
