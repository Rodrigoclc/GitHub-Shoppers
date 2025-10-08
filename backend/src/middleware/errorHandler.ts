import { Request, Response, NextFunction } from 'express';
import config from '../config/environment';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let { statusCode = 500, message } = error;

  // Log do erro para debugging
  console.error('Error caught by error handler:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
    timestamp: new Date().toISOString()
  });

  // Não expor detalhes internos em produção
  if (config.nodeEnv === 'production' && statusCode === 500) {
    message = 'Erro interno do servidor';
  }

  // Resposta de erro padronizada
  res.status(statusCode).json({
    error: getErrorType(statusCode),
    message,
    ...(config.nodeEnv === 'development' && {
      stack: error.stack,
      details: {
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString()
      }
    })
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    error: 'Endpoint não encontrado',
    message: `A rota ${req.method} ${req.originalUrl} não existe`
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

function getErrorType(statusCode: number): string {
  switch (statusCode) {
    case 400:
      return 'Requisição inválida';
    case 401:
      return 'Não autorizado';
    case 403:
      return 'Acesso negado';
    case 404:
      return 'Não encontrado';
    case 409:
      return 'Conflito';
    case 422:
      return 'Dados inválidos';
    case 429:
      return 'Muitas requisições';
    case 500:
      return 'Erro interno do servidor';
    case 502:
      return 'Gateway inválido';
    case 503:
      return 'Serviço indisponível';
    default:
      return 'Erro';
  }
}
