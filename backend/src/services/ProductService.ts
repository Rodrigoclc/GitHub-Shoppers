import { IProductRepository } from '../interfaces/repository/IProductRepository';
import { CreateProductDto } from '../dto/CreateProductDto';
import { Product } from '../entities/Product';

export class ProductService {
  private productRepository: IProductRepository;

  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  async createItem(itemData: CreateProductDto): Promise<Product> {
    // Verificar se já existe um item com o mesmo nome
    const existingItem = await this.productRepository.existsByName(itemData.nome);
    if (existingItem) {
      throw new Error('Já existe um item com este nome');
    }

    // Validações adicionais
    if (itemData.preco <= 0) {
      throw new Error('Preço deve ser maior que zero');
    }

    if (itemData.qtd_atual < 0) {
      throw new Error('Quantidade não pode ser negativa');
    }

    return await this.productRepository.create(itemData);
  }

  async getAllItems(): Promise<Product[]> {
    return await this.productRepository.findAll();
  }
}
