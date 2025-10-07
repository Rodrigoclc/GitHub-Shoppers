import { IProductRepository } from "../interfaces/repository/IProductRepository";
import database from '../database/connection';
import { CreateProductDto } from "../dto/CreateProductDto";
import { Product } from "../entities/Product";
import { PoolClient } from "pg";

export class ProductRepository implements IProductRepository {
    async create(itemData: CreateProductDto): Promise<Product> {
    const query = `
      INSERT INTO itens (nome, preco, qtd_atual)
      VALUES ($1, $2, $3)
      RETURNING id, nome, preco, qtd_atual, created_at, updated_at
    `;
    
    const result = await database.query(query, [
      itemData.nome,
      itemData.preco,
      itemData.qtd_atual
    ]);
    
    return result.rows[0];
  }

  async findAll(): Promise<Product[]> {
    const query = `
      SELECT id, nome, preco, qtd_atual, created_at, updated_at
      FROM itens
      ORDER BY created_at DESC
    `;
    
    const result = await database.query(query);
    
    return result.rows;
  }

  async findById(id: number): Promise<Product | null> {
    const query = `
      SELECT id, nome, preco, qtd_atual, created_at, updated_at
      FROM itens
      WHERE id = $1
    `;
    
    const result = await database.query(query, [id]);
    
    return result.rows[0] || null;
  }

  async findByIdForUpdate(id: number, client: PoolClient): Promise<Product | null> {
    const query = `
      SELECT id, nome, preco, qtd_atual, created_at, updated_at
      FROM itens
      WHERE id = $1
      FOR UPDATE
    `;
    
    const result = await client.query(query, [id]);
    
    return result.rows[0] || null;
  }

  async updateQuantity(id: number, newQuantity: number): Promise<Product | null> {
    const query = `
      UPDATE itens
      SET qtd_atual = $2
      WHERE id = $1
      RETURNING id, nome, preco, qtd_atual, created_at, updated_at
    `;
    
    const result = await database.query(query, [id, newQuantity]);
    
    return result.rows[0] || null;
  }

  async decrementQuantity(id: number, client: PoolClient): Promise<Product | null> {
    const query = `
      UPDATE itens
      SET qtd_atual = qtd_atual - 1
      WHERE id = $1 AND qtd_atual > 0
      RETURNING id, nome, preco, qtd_atual, created_at, updated_at
    `;
    
    const result = await client.query(query, [id]);
    
    return result.rows[0] || null;
  }

  async update(id: number, itemData: Partial<Product>): Promise<Product | null> {
    const fields = Object.keys(itemData).filter(key => key !== 'id');
    const values = fields.map(field => itemData[field as keyof Product]);
    
    if (fields.length === 0) {
      return this.findById(id);
    }
    
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    
    const query = `
      UPDATE itens
      SET ${setClause}
      WHERE id = $1
      RETURNING id, nome, preco, qtd_atual, created_at, updated_at
    `;
    
    const result = await database.query(query, [id, ...values]);
    
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM itens WHERE id = $1`;
    
    const result = await database.query(query, [id]);
    
    return result.rowCount > 0;
  }

  async existsByName(nome: string): Promise<boolean> {
    const query = `
      SELECT 1 FROM itens WHERE LOWER(nome) = LOWER($1) LIMIT 1
    `;
    
    const result = await database.query(query, [nome]);
    
    return result.rows.length > 0;
  }
}