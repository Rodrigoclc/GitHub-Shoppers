import axios from 'axios';
import config from '../config/environment';
import { GitHubUserDto } from '../dto/GitHubUserDto';

export class GitHubService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.github.apiUrl;
  }

  async getRandomUser(): Promise<string> {
    try {
      // Gerar um ID aleatório para buscar usuários
      // GitHub API permite buscar usuários a partir de um ID específico
      const randomSince = Math.floor(Math.random() * 100000000);
      
      const response = await axios.get<GitHubUserDto[]>(`${this.baseUrl}/users`, {
        params: {
          since: randomSince,
          per_page: 30 // Buscar 30 usuários para ter mais opções
        },
        timeout: 10000, // 10 segundos de timeout
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'GitHub-Shoppers-API'
        }
      });

      if (!response.data || response.data.length === 0) {
        throw new Error('Nenhum usuário encontrado na API do GitHub');
      }

      // Selecionar um usuário aleatório da lista retornada
      const randomIndex = Math.floor(Math.random() * response.data.length);
      const selectedUser = response.data[randomIndex];

      if (!selectedUser || !selectedUser.login) {
        throw new Error('Usuário selecionado não possui login válido');
      }

      return selectedUser.login;
    } catch (error) {
      console.error('Erro ao buscar usuário do GitHub:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Timeout ao conectar com a API do GitHub');
        } else if (error.response?.status === 403) {
          throw new Error('Limite de requisições da API do GitHub excedido');
        } else if (error.response && error.response.status >= 500) {
          throw new Error('Erro interno da API do GitHub');
        }
      }
      
      throw new Error('Falha ao obter usuário aleatório do GitHub');
    }
  }

  async getUserInfo(login: string): Promise<GitHubUserDto | null> {
    try {
      const response = await axios.get<GitHubUserDto>(`${this.baseUrl}/users/${login}`, {
        timeout: 10000,
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'GitHub-Shoppers-API'
        }
      });

      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar informações do usuário ${login}:`, error);
      
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null; // Usuário não encontrado
      }
      
      throw new Error(`Falha ao obter informações do usuário ${login}`);
    }
  }

  async validateUserExists(login: string): Promise<boolean> {
    try {
      const user = await this.getUserInfo(login);
      return user !== null;
    } catch (error) {
      return false;
    }
  }
}
