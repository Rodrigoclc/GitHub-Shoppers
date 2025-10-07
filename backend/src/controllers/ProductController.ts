import { Request, Response } from 'express';
import { IProductService } from '../interfaces/services/IProductService';
import { CreateProductDto } from '../dto/CreateProductDto';

export class ProductController {
  private _productService: IProductService;

  constructor(productService: IProductService) {
    this._productService = productService;
  }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const itemData: CreateProductDto = req.body;
      
      const item = await this._productService.createItem(itemData);
      
      res.status(201).json({
        message: 'Item criado com sucesso',
        data: { item }
      });
    } catch (error) {
      console.error('Erro ao criar item:', error);
      
      if (error instanceof Error) {
        if (error.message === 'Já existe um item com este nome') {
          res.status(409).json({
            error: 'Conflito',
            message: error.message
          });
          return;
        }
        
        if (error.message.includes('deve ser maior que zero') || 
            error.message.includes('não pode ser negativa')) {
          res.status(400).json({
            error: 'Dados inválidos',
            message: error.message
          });
          return;
        }
      }
      
      res.status(500).json({
        error: 'Erro interno do servidor',
        message: 'Falha ao criar item'
      });
    }
  };

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const items = await this._productService.getAllItems();
      
      res.status(200).json({
        message: 'Itens obtidos com sucesso',
        data: { items }
      });
    } catch (error) {
      console.error('Erro ao obter itens:', error);
      
      res.status(500).json({
        error: 'Erro interno do servidor',
        message: 'Falha ao obter lista de itens'
      });
    }
  };
}
