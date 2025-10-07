import { CreateProductDto } from '../../dto/CreateProductDto';
import { Product } from '../../entities/Product';

export interface IProductService {
  createItem(itemData: CreateProductDto): Promise<Product>;
  getAllItems(): Promise<Product[]>;
}