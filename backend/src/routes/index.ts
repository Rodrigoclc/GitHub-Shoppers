import { Router } from 'express';
import authRoutes from './auth';
import itensRoutes from './item';
import comprasRoutes from './purchase';

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

// Rotas da aplicação
router.use('/auth', authRoutes);
router.use('/itens', itensRoutes);
router.use('/compras', comprasRoutes);

export default router;
