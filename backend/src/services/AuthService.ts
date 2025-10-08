import bcrypt from 'bcrypt';
import { IUserRepository } from '../interfaces/repository/IUserRepository';
import { CreateUserDto } from '../dto/CreateUserDto';
import { LoginDto } from '../dto/LoginDto';
import { User } from '../entities/User'
import { AuthPayloadDto } from '../dto/AuthPayloadDto';
import { JwtUtils } from '../utils/jwt';

export class AuthService {
  private usuarioRepository: IUserRepository;
  private saltRounds = 12;

  constructor(usuarioRepository: IUserRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async register(userData: CreateUserDto): Promise<{ user: Omit<User, 'password_hash'>, token: string }> {
    const existingUser = await this.usuarioRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email já está em uso');
    }

    const password_hash = await bcrypt.hash(userData.password, this.saltRounds);

    const user = await this.usuarioRepository.create({
      ...userData,
      password_hash
    });

    const authPayload: AuthPayloadDto = {
      userId: user.id,
      email: user.email,
      role: user.role
    };
    
    const token = JwtUtils.generateToken(authPayload);

    const { password_hash: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token
    };
  }

  async login(loginData: LoginDto): Promise<{ user: Omit<User, 'password_hash'>, token: string }> {
    const user = await this.usuarioRepository.findByEmail(loginData.email);
    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(loginData.password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Credenciais inválidas');
    }

    const authPayload: AuthPayloadDto = {
      userId: user.id,
      email: user.email,
      role: user.role
    };
    
    const token = JwtUtils.generateToken(authPayload);

    const { password_hash: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token
    };
  }

  async getUserById(id: number): Promise<Omit<User, 'password_hash'> | null> {
    const user = await this.usuarioRepository.findById(id);
    if (!user) {
      return null;
    }

    const { password_hash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.usuarioRepository.findById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isCurrentPasswordValid) {
      throw new Error('Senha atual incorreta');
    }

    const newPasswordHash = await bcrypt.hash(newPassword, this.saltRounds);

    await this.usuarioRepository.update(userId, { password_hash: newPasswordHash });
  }

  async validateToken(token: string): Promise<AuthPayloadDto> {
    try {
      const decoded = JwtUtils.verifyToken(token);
      
      const user = await this.usuarioRepository.findById(decoded.userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      return decoded;
    } catch (error) {
      throw new Error('Token inválido ou expirado');
    }
  }
}
