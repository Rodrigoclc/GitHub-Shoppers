import { Router } from 'express';

const router = Router();

// Rota de health check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'GitHub Shoppers API está funcionando',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

export default router;
