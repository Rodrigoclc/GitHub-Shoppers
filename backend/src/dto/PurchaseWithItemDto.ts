import { Purchase } from "../entities/Purchase";

export interface PurchaseWithItemDto extends Purchase {
  itemName: string;
  itemPrice: number;
}
