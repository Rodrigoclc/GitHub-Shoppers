import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface User {
  id: number;
  email: string;
}

export interface AuthResponse {
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface Item {
  id: number;
  nome: string;
  preco: number;
  qtd_atual: number;
  created_at?: string;
  updated_at?: string;
}

export interface Purchase {
  id: number;
  item_id: number;
  comprador_github_login: string;
  created_at: string;
  updated_at?: string;
  item?: Item;
  itemname?: string;
  itemprice?: string;
}

export const authApi = {
  register: (email: string, password: string, role: string) =>
    api.post<AuthResponse>('/auth/register', { email, password, role }),
  
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }),
};

export const itemsApi = {
  getAll: () => api.get<{ data: { items: Item[] } }>('/itens'),
  
  create: (nome: string, preco: number, qtd_atual: number) =>
    api.post<{ data: { item: Item } }>('/itens', { nome, preco, qtd_atual }),
};

export const purchasesApi = {
  getAll: () => api.get<{ data: { compras: Purchase[] } }>('/compras'),
  
  create: (item_id: number) =>
    api.post<{ data: { compra: Purchase } }>('/compras', { item_id }),
};

export default api;
