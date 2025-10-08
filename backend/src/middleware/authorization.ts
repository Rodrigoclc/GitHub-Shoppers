import { Request, Response, NextFunction } from 'express';

export const requireRole = (allowedRoles: ('admin' | 'user')[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Não autorizado',
        message: 'Token de autenticação é obrigatório'
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: 'Acesso negado',
        message: `Acesso restrito. Roles permitidos: ${allowedRoles.join(', ')}`
      });
      return;
    }

    next();
  };
};

export const requireAdmin = requireRole(['admin']);
export const requireUser = requireRole(['user', 'admin']); // Admin pode fazer tudo que user faz
