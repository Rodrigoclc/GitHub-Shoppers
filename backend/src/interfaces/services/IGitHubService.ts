import { GitHubUserDto } from '../../dto/GitHubUserDto';

export interface IGitHubService {
  getRandomUser(): Promise<string>;
  getUserInfo(login: string): Promise<GitHubUserDto | null>;
  validateUserExists(login: string): Promise<boolean>;
}