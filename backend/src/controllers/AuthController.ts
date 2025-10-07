import { Request, Response } from 'express';
import { IAuthService } from '../interfaces/services/IAuthService';
import { CreateUserDto } from '../dto/CreateUserDto';
import { LoginDto } from '../dto/LoginDto';

export class AuthController {
  private authService: IAuthService;

  constructor(authService: IAuthService) {
    this.authService = authService;
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      
      const result = await this.authService.register(userData);
      
      res.status(201).json({
        message: 'Usuário criado com sucesso',
        data: {
          user: result.user,
          token: result.token
        }
      });
    } catch (error) {
      console.error('Erro no registro:', error);
      
      if (error instanceof Error) {
        if (error.message === 'Email já está em uso') {
          res.status(409).json({
            error: 'Conflito',
            message: error.message
          });
          return;
        }
      }
      
      res.status(500).json({
        error: 'Erro interno do servidor',
        message: 'Falha ao criar usuário'
      });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const loginData: LoginDto = req.body;
      
      const result = await this.authService.login(loginData);
      
      res.status(200).json({
        message: 'Login realizado com sucesso',
        data: {
          user: result.user,
          token: result.token
        }
      });
    } catch (error) {
      console.error('Erro no login:', error);
      
      if (error instanceof Error && error.message === 'Credenciais inválidas') {
        res.status(401).json({
          error: 'Não autorizado',
          message: 'Email ou senha incorretos'
        });
        return;
      }
      
      res.status(500).json({
        error: 'Erro interno do servidor',
        message: 'Falha ao realizar login'
      });
    }
  };

  getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'Não autorizado',
          message: 'Token de autenticação inválido'
        });
        return;
      }

      const user = await this.authService.getUserById(req.user.userId);
      
      if (!user) {
        res.status(404).json({
          error: 'Usuário não encontrado',
          message: 'O usuário associado ao token não foi encontrado'
        });
        return;
      }

      res.status(200).json({
        message: 'Perfil obtido com sucesso',
        data: { user }
      });
    } catch (error) {
      console.error('Erro ao obter perfil:', error);
      
      res.status(500).json({
        error: 'Erro interno do servidor',
        message: 'Falha ao obter perfil do usuário'
      });
    }
  };

  changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'Não autorizado',
          message: 'Token de autenticação inválido'
        });
        return;
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        res.status(400).json({
          error: 'Dados inválidos',
          message: 'Senha atual e nova senha são obrigatórias'
        });
        return;
      }

      if (newPassword.length < 6) {
        res.status(400).json({
          error: 'Dados inválidos',
          message: 'Nova senha deve ter pelo menos 6 caracteres'
        });
        return;
      }

      await this.authService.changePassword(req.user.userId, currentPassword, newPassword);

      res.status(200).json({
        message: 'Senha alterada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      
      if (error instanceof Error && error.message === 'Senha atual incorreta') {
        res.status(400).json({
          error: 'Dados inválidos',
          message: error.message
        });
        return;
      }
      
      res.status(500).json({
        error: 'Erro interno do servidor',
        message: 'Falha ao alterar senha'
      });
    }
  };
}
