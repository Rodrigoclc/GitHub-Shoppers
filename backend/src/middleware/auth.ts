import { Request, Response, NextFunction } from 'express';
import { JwtUtils } from '../utils/jwt';
import { AuthPayloadDto } from '../dto/AuthPayloadDto';

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayloadDto;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = JwtUtils.extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      res.status(401).json({
        error: 'Token de acesso não fornecido',
        message: 'É necessário fornecer um token de autenticação válido'
      });
      return;
    }

    const decoded = JwtUtils.verifyToken(token);
    req.user = decoded;
    
    next();
  } catch (error) {
    res.status(401).json({
      error: 'Token inválido',
      message: error instanceof Error ? error.message : 'Falha na autenticação'
    });
  }
};
