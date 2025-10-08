import { UserRole } from "../entities/User";

export interface CreateUserDto {
  email: string;
  password: string;
  role: UserRole;
}