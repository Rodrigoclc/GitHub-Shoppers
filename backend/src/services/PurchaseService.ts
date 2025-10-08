import database from '../database/connection';
import { IProductRepository } from '../interfaces/repository/IProductRepository';
import { CreatePurchaseDto } from '../dto/createPurchaseDto';
import { IPurchaseRepository } from '../interfaces/repository/IPurchaseRepository';
import { IGitHubService } from '../interfaces/services/IGitHubService';
import { PurchaseWithItemDto } from '../dto/PurchaseWithItemDto';

export class PurchaseService {
  private purchaseRepository: IPurchaseRepository;
  private productRepository: IProductRepository;
  private gitHubService: IGitHubService;

  constructor(purchaseRepository: IPurchaseRepository, gitHubService: IGitHubService, productRepository: IProductRepository) {
    this.purchaseRepository = purchaseRepository;
    this.productRepository = productRepository;
    this.gitHubService = gitHubService;
  }

  async createPurchase(purchaseData: CreatePurchaseDto): Promise<PurchaseWithItemDto> {
    return await database.transaction(async (client) => {
      const item = await this.productRepository.findByIdForUpdate(purchaseData.item_id, client);

      if (!item) {
        throw new Error('Item não encontrado');
      }

      if (item.qtd_atual <= 0) {
        const error = new Error('Item fora de estoque.');
        (error as any).statusCode = 409;
        throw error;
      }

      let compradorGitHubLogin: string;
      try {
        compradorGitHubLogin = await this.gitHubService.getRandomUser();
      } catch (error) {
        console.error('Erro ao obter usuário do GitHub:', error);
        throw new Error('Falha ao obter comprador do GitHub. Tente novamente.');
      }

      const updatedItem = await this.productRepository.decrementQuantity(purchaseData.item_id, client);
      
      if (!updatedItem) {
        const error = new Error('Item fora de estoque.');
        (error as any).statusCode = 409; // Conflict
        throw error;
      }

      const purchase = await this.purchaseRepository.create({
        item_id: purchaseData.item_id,
        comprador_github_login: compradorGitHubLogin
      }, client);

      return {
        ...purchase,
        itemName: item.nome,
        itemPrice: item.preco
      };
    });
  }

  async getAllCompras(): Promise<PurchaseWithItemDto[]> {
    return await this.purchaseRepository.findAllWithItems();
  }
}
