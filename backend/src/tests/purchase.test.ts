import request from 'supertest';
import app from '../app';
import { TestUtils } from './utils';
import { Product } from '../entities/Product';

jest.mock('../services/GitHubService', () => {
  return {
    GitHubService: jest.fn().mockImplementation(() => ({
      getRandomUser: jest.fn().mockResolvedValue('mockeduser'),
      getUserInfo: jest.fn().mockResolvedValue({
        login: 'mockeduser',
        id: 12345,
        avatar_url: 'https://github.com/mockeduser.png'
      }),
      validateUserExists: jest.fn().mockResolvedValue(true),
      // Adicione estes se necessário:
      getUserRepos: jest.fn().mockResolvedValue([]),
      // E métodos para simular erros:
      getUserInfoWithError: jest.fn().mockRejectedValue(new Error('GitHub API error'))
    }))
  };
});

describe('Compras Endpoints', () => {
  let token: string;
  let itemComEstoque: any;
  let itemSemEstoque: any;

  beforeEach(async () => {
    await TestUtils.clearDatabase();
    const userToken = await TestUtils.createTestUser(undefined, undefined, "admin");
    token = userToken;

    itemComEstoque = await TestUtils.createTestItem(token, {
      nome: 'Notebook Gamer',
      preco: 2500.00,
      qtd_atual: 5
    });

    itemSemEstoque = await TestUtils.createTestItem(token, {
      nome: 'Mouse Gamer',
      preco: 150.00,
      qtd_atual: 0
    });
  });

  describe('POST /api/compras', () => {
    it('deve criar compra com sucesso quando há estoque disponível', async () => {
      const compraData = {
        item_id: itemComEstoque.id
      };

      const response = await request(app)
        .post('/api/compras')
        .set('Authorization', `Bearer ${token}`)
        .send(compraData);

      TestUtils.expectSuccessResponse(response, 201);
      expect(response.body.data.compra).toHaveProperty('id');
      expect(response.body.data.compra.item_id).toBe(itemComEstoque.id);
      expect(response.body.data.compra).toHaveProperty('comprador_github_login');
      expect(response.body.data.compra.comprador_github_login).toBe('mockeduser');
      expect(response.body.data.compra).toHaveProperty('itemName');
      expect(response.body.data.compra).toHaveProperty('itemPrice');
    });

    it('deve decrementar corretamente o estoque após a compra', async () => {
      const compraData = {
        item_id: itemComEstoque.id
      };

      await request(app)
        .post('/api/compras')
        .set('Authorization', `Bearer ${token}`)
        .send(compraData);

      const itensResponse = await request(app)
        .get(`/api/itens`)
        .set('Authorization', `Bearer ${token}`);
      itensResponse.body.data.items.forEach((item: Product) => {
        if (item.nome == itemComEstoque.nome) expect(item.qtd_atual).toBe(itemComEstoque.qtd_atual - 1);
      });
      
    });

    it('deve retornar erro 409 Conflict quando item está fora de estoque', async () => {
      const compraData = {
        item_id: itemSemEstoque.id
      };

      const response = await request(app)
        .post('/api/compras')
        .set('Authorization', `Bearer ${token}`)
        .send(compraData);

      expect(response.status).toBe(409);
      expect(response.body.error).toMatch(/item fora de estoque/i);
      expect(response.body.message).toBe('Item fora de estoque.');
    });

    it('deve retornar erro para item inexistente', async () => {
      const compraData = {
        item_id: 99999
      };

      const response = await request(app)
        .post('/api/compras')
        .set('Authorization', `Bearer ${token}`)
        .send(compraData);

      TestUtils.expectNotFoundError(response);
    });

    it('deve retornar erro para dados inválidos', async () => {
      const compraData = {
        item_id: 'abc'
      };

      const response = await request(app)
        .post('/api/compras')
        .set('Authorization', `Bearer ${token}`)
        .send(compraData);

      TestUtils.expectValidationError(response, 'item_id');
    });

    it('deve retornar erro sem autenticação', async () => {
      const compraData = {
        item_id: itemComEstoque.id
      };

      const response = await request(app)
        .post('/api/compras')
        .send(compraData);

      TestUtils.expectAuthError(response);
    });
  });

  describe('GET /api/compras', () => {
    beforeEach(async () => {
      await TestUtils.createTestCompra(token, itemComEstoque.id);
      await TestUtils.createTestCompra(token, itemComEstoque.id);
    });

    it('deve listar todas as compras com dados do item (JOIN)', async () => {
      const response = await request(app)
        .get('/api/compras')
        .set('Authorization', `Bearer ${token}`);

      TestUtils.expectSuccessResponse(response);
      expect(response.body.data.compras).toHaveLength(2);
      
      const compra = response.body.data.compras[0];
      expect(compra).toHaveProperty('id');
      expect(compra).toHaveProperty('item_id');
      expect(compra).toHaveProperty('comprador_github_login');
      expect(compra).toHaveProperty('itemname');
      expect(compra).toHaveProperty('itemprice');
      expect(compra).toHaveProperty('created_at');
    });

    it('deve retornar erro sem autenticação', async () => {
      const response = await request(app)
        .get('/api/compras');

      TestUtils.expectAuthError(response);
    });
  });
});