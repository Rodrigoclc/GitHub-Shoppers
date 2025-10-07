import { Purchase } from "../entities/Purchase";

export interface PurchaseWithItemDto extends Purchase {
  item_nome: string;
  item_preco: number;
}
