export interface AuthPayloadDto {
  userId: number;
  email: string;
  role: 'admin' | 'user';
}