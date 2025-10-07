import { UserRole } from "../entities/User";

export interface AuthPayloadDto {
  userId: number;
  email: string;
  role: UserRole;
}