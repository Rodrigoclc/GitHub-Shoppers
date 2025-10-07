import { PoolClient } from "pg";
import { CreatePurchaseDto } from "../dto/createPurchaseDto";
import { Purchase } from "../entities/Purchase";
import { IPurchaseRepository } from "../interfaces/repository/IPurchaseRepository";
import database from "../database/connection";
import { PurchaseWithItemDto } from "../dto/PurchaseWithItemDto";

export class PurchaseRepository implements IPurchaseRepository {
  async create(compraData: CreatePurchaseDto & { comprador_github_login: string } ): Promise<Purchase> {
    const query = `
      INSERT INTO compras (item_id, comprador_github_login)
      VALUES ($1, $2)
      RETURNING id, item_id, comprador_github_login, created_at, updated_at
    `;

    const result = await database.query(query, [
      compraData.item_id,
      compraData.comprador_github_login,
    ]);

    return result.rows[0];
  }
  async findAllWithItems(): Promise<PurchaseWithItemDto[]> {
    const query = `
      SELECT 
        c.id,
        c.item_id,
        c.comprador_github_login,
        c.created_at,
        c.updated_at,
        i.nome as item_nome,
        i.preco as item_preco
      FROM compras c
      INNER JOIN itens i ON c.item_id = i.id
      ORDER BY c.created_at DESC
    `;

    const result = await database.query(query);

    return result.rows;
  }
}
