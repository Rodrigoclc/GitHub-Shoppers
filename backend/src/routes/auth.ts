import { Router } from 'express';

const router = Router();

// Rotas públicas
router.post('/register', (req, res) => { return res.send('Register endpoint'); });
router.post('/login', (req, res) => { return res.send('Login endpoint'); });

// Rotas protegidas
router.get('/profile', (req, res)=> { return res.send('Profile endpoint'); });
router.put('/change-password', (req, res) => { return res.send('Change password endpoint'); });

export default router;
