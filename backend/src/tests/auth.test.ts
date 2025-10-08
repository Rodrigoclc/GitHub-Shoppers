import request from 'supertest';
import app from '../app';
import { TestUtils } from './utils';

describe('Auth Endpoints', () => {
  beforeEach(async () => {
    await TestUtils.clearDatabase();
  });

  describe('POST /api/auth/register', () => {
    it('deve registrar um novo usuário com dados válidos', async () => {
      const userData = {
        email: 'novo@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      TestUtils.expectSuccessResponse(response, 201);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user).not.toHaveProperty('password_hash');
    });

    it('deve retornar erro para email inválido', async () => {
      const userData = {
        email: 'email-invalido',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      TestUtils.expectValidationError(response, 'email');
    });

    it('deve retornar erro para senha muito curta', async () => {
      const userData = {
        email: 'test@example.com',
        password: '123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      TestUtils.expectValidationError(response, 'password');
    });

    it('deve retornar erro para email já existente', async () => {
      const userData = {
        email: 'duplicado@example.com',
        password: 'password123'
      };

      // Primeiro registro
      await request(app)
        .post('/api/auth/register')
        .send(userData);

      // Segundo registro com mesmo email
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      TestUtils.expectConflictError(response);
      expect(response.body.message).toMatch(/email já está em uso/i);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Criar usuário para testes de login
      await TestUtils.createTestUser('login@example.com', 'password123');
    });

    it('deve fazer login com credenciais válidas', async () => {
      const loginData = {
        email: 'login@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      TestUtils.expectSuccessResponse(response);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user.email).toBe(loginData.email);
      expect(response.body.data.user).toHaveProperty('role', 'user');
    });

    it('deve retornar erro para email inexistente', async () => {
      const loginData = {
        email: 'inexistente@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(401);
      expect(response.body.message).toMatch(/email ou senha incorretos/i);
    });

    it('deve retornar erro para senha incorreta', async () => {
      const loginData = {
        email: 'login@example.com',
        password: 'senhaerrada'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(401);
      expect(response.body.message).toMatch(/email ou senha incorretos/i);
    });

    it('deve retornar erro para dados de entrada inválidos', async () => {
      const loginData = {
        email: 'email-invalido',
        password: ''
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      TestUtils.expectValidationError(response);
    });
  });
});