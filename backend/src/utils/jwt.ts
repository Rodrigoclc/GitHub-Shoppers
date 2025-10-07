import jwt from 'jsonwebtoken';
import config from '../config/environment';
import { AuthPayloadDto } from '../dto/AuthPayloadDto';

export class JwtUtils {
  static generateToken(payload: AuthPayloadDto): string {
    return (jwt as any).sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
  }

  static verifyToken(token: string): AuthPayloadDto {
    try {
      const decoded = (jwt as any).verify(token, config.jwt.secret) as AuthPayloadDto;
      
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token expirado');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Token inválido');
      } else {
        throw new Error('Erro ao verificar token');
      }
    }
  }

  static extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader) {
      return null;
    }

    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }

    return parts[1] || null;
  }
}
