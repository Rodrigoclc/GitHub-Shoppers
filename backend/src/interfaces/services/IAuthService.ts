import { CreateUserDto } from '../../dto/CreateUserDto';
import { LoginDto } from '../../dto/LoginDto';
import { User } from '../../entities/User';
import { AuthPayloadDto } from '../../dto/AuthPayloadDto';

export interface IAuthService {
  register(userData: CreateUserDto): Promise<{ user: Omit<User, 'password_hash'>, token: string }>;
  login(loginData: LoginDto): Promise<{ user: Omit<User, 'password_hash'>, token: string }>;
  getUserById(id: number): Promise<Omit<User, 'password_hash'> | null>;
  changePassword(userId: number, currentPassword: string, newPassword: string): Promise<void>;
  validateToken(token: string): Promise<AuthPayloadDto>;
}