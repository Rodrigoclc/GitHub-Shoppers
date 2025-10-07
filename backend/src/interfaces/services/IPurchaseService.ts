import { CreatePurchaseDto } from '../../dto/createPurchaseDto';
import { PurchaseWithItemDto } from '../../dto/PurchaseWithItemDto';

export interface IPurchaseService {
  createPurchase(purchaseData: CreatePurchaseDto): Promise<PurchaseWithItemDto>;
  getAllCompras(): Promise<CreatePurchaseDto[]>;
}