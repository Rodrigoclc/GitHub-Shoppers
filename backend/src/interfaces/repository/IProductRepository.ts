import { Product } from '../../entities/Product';
import { CreateProductDto } from '../../dto/CreateProductDto';

export interface IProductRepository {
  create(itemData: CreateProductDto): Promise<Product>;
  findAll(): Promise<Product[]>;
  findById(id: number): Promise<Product | null>;
  findByIdForUpdate(id: number): Promise<Product | null>;
  updateQuantity(id: number, newQuantity: number): Promise<Product | null>;
  decrementQuantity(id: number): Promise<Product | null>;
  update(id: number, itemData: Partial<Product>): Promise<Product | null>;
  delete(id: number): Promise<boolean>;
  existsByName(nome: string): Promise<boolean>;
}