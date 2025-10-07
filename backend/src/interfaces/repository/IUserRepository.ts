import { CreateUserDto } from '../../dto/CreateUserDto';
import { User } from '../../entities/User';

export interface IUserRepository {
  create(userData: CreateUserDto & { password_hash: string }): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  existsByEmail(email: string): Promise<boolean>;
  update(id: number, userData: Partial<User>): Promise<User | null>;
  delete(id: number): Promise<boolean>;
}
