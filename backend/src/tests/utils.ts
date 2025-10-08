import database from '../database/connection';
import request from 'supertest';
import app from '../app';
import { CreateProductDto } from '../dto/CreateProductDto';

export class TestUtils {
  static async clearDatabase(): Promise<void> {
    // Limpar tabelas na ordem correta (respeitando foreign keys)
    await database.query('DELETE FROM compras');
    await database.query('DELETE FROM itens');
    await database.query('DELETE FROM usuarios');
    
    // Reset sequences
    await database.query('ALTER SEQUENCE compras_id_seq RESTART WITH 1');
    await database.query('ALTER SEQUENCE itens_id_seq RESTART WITH 1');
    await database.query('ALTER SEQUENCE usuarios_id_seq RESTART WITH 1');
  }

  static expectSuccessResponse(response: any, statusCode: number = 200): void {
    expect(response.status).toBe(statusCode);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('data');
  }

  static expectValidationError(response: any, field?: string): void {
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body).toHaveProperty('details');
    
    if (field) {
      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field })
        ])
      );
    }
  }

  static async createTestUser(
    email: string = 'test@example.com', 
    password: string = 'password123',
    role?: 'admin' | 'user'
  ): Promise<string> {
    const userData: any = { email, password };
    if (role) {
      userData.role = role;
    }

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData);

    return response.body.data.token;
  }

  static expectAuthError(response: any): void {
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toMatch(/não autorizado|token|autenticação/i);
  }

  static async createTestItem(token: string, itemData: CreateProductDto): Promise<any> {
    const response = await request(app)
      .post('/api/itens')
      .set('Authorization', `Bearer ${token}`)
      .send(itemData);

    return response.body.data.item;
  }

  static expectNotFoundError(response: any): void {
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toMatch(/não encontrado/i);
  }

  static async createTestCompra(token: string, itemId: number): Promise<any> {
    const response = await request(app)
      .post('/api/compras')
      .set('Authorization', `Bearer ${token}`)
      .send({ item_id: itemId });

    return response.body.data.compras;
  }
}