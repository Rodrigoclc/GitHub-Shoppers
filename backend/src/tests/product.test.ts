import request from 'supertest';
import app from '../app';
import { TestUtils } from './utils';

describe('Itens Endpoints', () => {
  let token: string;

  beforeEach(async () => {
    await TestUtils.clearDatabase();
    const { token: userToken } = await TestUtils.createTestUser(undefined, undefined, "admin");
    token = userToken;
  });

  describe('POST /api/itens', () => {
    it('deve criar um novo item com dados válidos', async () => {
      const itemData = {
        nome: 'Teclado Gamer',
        preco: 2500.99,
        qtd_atual: 5
      };

      const response = await request(app)
        .post('/api/itens')
        .set('Authorization', `Bearer ${token}`)
        .send(itemData);

      TestUtils.expectSuccessResponse(response, 201);
      expect(response.body.data.item).toHaveProperty('id');
      expect(response.body.data.item).toHaveProperty('created_at');
    });

    it('deve retornar erro para dados inválidos', async () => {
      const itemData = {
        nome: '',
        preco: -100,
        qtd_atual: -5
      };

      const response = await request(app)
        .post('/api/itens')
        .set('Authorization', `Bearer ${token}`)
        .send(itemData);

      TestUtils.expectValidationError(response);
    });

    it('deve retornar erro para nome duplicado', async () => {
      const itemData = {
        nome: 'Produto Duplicado',
        preco: 100,
        qtd_atual: 1
      };

      // Primeiro item
      await request(app)
        .post('/api/itens')
        .set('Authorization', `Bearer ${token}`)
        .send(itemData);

      // Segundo item com mesmo nome
      const response = await request(app)
        .post('/api/itens')
        .set('Authorization', `Bearer ${token}`)
        .send(itemData);

      TestUtils.expectConflictError(response);
      expect(response.body.message).toMatch(/já existe um item com este nome/i);
    });

    it('deve retornar erro sem autenticação', async () => {
      const itemData = {
        nome: 'Produto Teste',
        preco: 100,
        qtd_atual: 1
      };

      const response = await request(app)
        .post('/api/itens')
        .send(itemData);

      TestUtils.expectAuthError(response);
    });
  });

  describe('GET /api/itens', async () => {
    await beforeEach(async () => {
      await TestUtils.createTestItem(token, { nome: 'Item 1', preco: 100, qtd_atual: 10 });
      await TestUtils.createTestItem(token, { nome: 'Item 2', preco: 200, qtd_atual: 0 });
      await TestUtils.createTestItem(token, { nome: 'Item 3', preco: 300, qtd_atual: 5 });
    });

    it('deve listar todos os itens', async () => {
      const response = await request(app)
        .get('/api/itens')
        .set('Authorization', `Bearer ${token}`);

      TestUtils.expectSuccessResponse(response);
      expect(response.body.data.items).toHaveLength(3);
      expect(response.body.data.items[0]).toHaveProperty('id');
      expect(response.body.data.items[0]).toHaveProperty('nome');
      expect(response.body.data.items[0]).toHaveProperty('preco');
      expect(response.body.data.items[0]).toHaveProperty('qtd_atual');
    });

    it('deve retornar erro sem autenticação', async () => {
      const response = await request(app)
        .get('/api/itens');

      TestUtils.expectAuthError(response);
    });
  });
});