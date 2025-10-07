export interface User {
  id: number;
  email: string;
  password_hash: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

export type UserRole = 'admin' | 'user';
