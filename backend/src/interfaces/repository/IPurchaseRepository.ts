import { CreatePurchaseDto } from '../../dto/createPurchaseDto';
import { PurchaseWithItemDto } from '../../dto/PurchaseWithItemDto';
import { Purchase } from '../../entities/Purchase';

export interface IPurchaseRepository {
  create(compraData: CreatePurchaseDto & { comprador_github_login: string } ): Promise<Purchase>;
  findAllWithItems(): Promise<PurchaseWithItemDto[]>;
}
