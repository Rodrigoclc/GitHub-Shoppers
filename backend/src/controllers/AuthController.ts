import { Request, response, Response } from "express";
import { IAuthService } from "../interfaces/services/IAuthService";
import { CreateUserDto } from "../dto/CreateUserDto";
import { LoginDto } from "../dto/LoginDto";
import { IApiResponse } from "../interfaces/IApiResponse";

export class AuthController {
  private authService: IAuthService;

  constructor(authService: IAuthService) {
    this.authService = authService;
  }

  register = async (req: Request, res: Response): Promise<void> => {
    let response: IApiResponse = { message: "" };
    try {
      const userData: CreateUserDto = req.body;

      const result = await this.authService.register(userData);

      response.data = {
        user: result.user,
        token: result.token,
      };
      response.message = "Usuário criado com sucesso";
      res.status(201).json(response);
    } catch (error) {
      console.error("Erro no registro:", error);

      if (error instanceof Error && error.message === "Email já está em uso") {
        response.error = "Conflito";
        response.message = error.message;
        res.status(409).json(response);
        return;
      }
      response.error = "Erro interno do servidor";
      response.message = "Falha ao criar usuário";
      res.status(500).json(response);
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    let response: IApiResponse = { message: "" };
    try {
      const loginData: LoginDto = req.body;

      const result = await this.authService.login(loginData);

      response.message = "Login realizado com sucesso";
      response.data = {
        user: result.user,
        token: result.token,
      };
      res.status(200).json(response);
    } catch (error) {
      console.error("Erro no login:", error);

      if (error instanceof Error && error.message === "Credenciais inválidas") {
        response.error = "Não autorizado";
        response.message = "Email ou senha incorretos";
        res.status(401).json(response);
        return;
      }
      response.error = "Erro interno do servidor";
      response.message = "Falha ao realizar login";
      res.status(500).json(response);
    }
  };

  getProfile = async (req: Request, res: Response): Promise<void> => {
    let response: IApiResponse = { message: "" };
    try {
      if (!req.user) {
        response.error = "Não autorizado";
        response.message = "Token de autenticação inválido";
        res.status(401).json(response);
        return;
      }

      const user = await this.authService.getUserById(req.user.userId);

      if (!user) {
        response.error = "Usuário não encontrado";
        response.message = "O usuário associado ao token não foi encontrado";
        res.status(404).json(response);
        return;
      }

      response.message = "Perfil obtido com sucesso";
      response.data = { user };
      res.status(200).json(response);
    } catch (error) {
      console.error("Erro ao obter perfil:", error);

      response.error = "Erro interno do servidor";
      response.message = "Falha ao obter perfil do usuário";
      res.status(500).json(response);
    }
  };

  changePassword = async (req: Request, res: Response): Promise<void> => {
    let response: IApiResponse = { message: "" };
    try {
      if (!req.user) {
        response.error = "Não autorizado";
        response.message = "Token de autenticação inválido";
        res.status(401).json(response);
        return;
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        response.error = "Dados inválidos";
        response.message = "Senha atual e nova senha são obrigatórias";
        res.status(400).json(response);
        return;
      }

      if (newPassword.length < 6) {
        response.error = "Dados inválidos";
        response.message = "Nova senha deve ter pelo menos 6 caracteres";
        res.status(400).json(response);
        return;
      }

      await this.authService.changePassword(
        req.user.userId,
        currentPassword,
        newPassword
      );
      response.message = "Senha alterada com sucesso";

      res.status(200).json(response);
    } catch (error) {
      console.error("Erro ao alterar senha:", error);

      if (error instanceof Error && error.message === "Senha atual incorreta") {
        response.error = "Dados inválidos";
        response.message = error.message;
        res.status(400).json(response);
        return;
      }
      response.error = "Erro interno do servidor";
      response.message = "Falha ao alterar senha";

      res.status(500).json(response);
    }
  };
}
