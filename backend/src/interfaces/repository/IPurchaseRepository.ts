import { PoolClient } from 'pg';
import { CreatePurchaseDto } from '../../dto/createPurchaseDto';
import { PurchaseWithItemDto } from '../../dto/PurchaseWithItemDto';
import { Purchase } from '../../entities/Purchase';

export interface IPurchaseRepository {
  create(compraData: CreatePurchaseDto & { comprador_github_login: string }, client: PoolClient ): Promise<Purchase>;
  findAllWithItems(): Promise<PurchaseWithItemDto[]>;
}
