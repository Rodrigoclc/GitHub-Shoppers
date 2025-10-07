import { Request, Response } from 'express';
import { IPurchaseService } from '../interfaces/services/IPurchaseService';
import { CreatePurchaseDto } from '../dto/createPurchaseDto';

export class PurchaseController {
  private _purchaseService: IPurchaseService;

  constructor(purchaseService: IPurchaseService) {
    this._purchaseService = purchaseService;
  }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const compraData: CreatePurchaseDto = req.body;
      
      const compra = await this._purchaseService.createPurchase(compraData);
      
      res.status(201).json({
        message: 'Compra realizada com sucesso',
        data: { compra }
      });
    } catch (error) {
      console.error('Erro ao criar compra:', error);
      
      if (error instanceof Error) {
        // Verificar se é erro de estoque (status 409)
        if ((error as any).statusCode === 409 || error.message === 'Item fora de estoque.') {
          res.status(409).json({
            error: 'Item fora de estoque',
            message: 'Item fora de estoque.'
          });
          return;
        }
        
        if (error.message === 'Item não encontrado') {
          res.status(404).json({
            error: 'Item não encontrado',
            message: error.message
          });
          return;
        }
        
        if (error.message.includes('GitHub')) {
          res.status(503).json({
            error: 'Serviço indisponível',
            message: 'Falha temporária na integração com GitHub. Tente novamente.'
          });
          return;
        }
      }
      
      res.status(500).json({
        error: 'Erro interno do servidor',
        message: 'Falha ao processar compra'
      });
    }
  };

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const compras = await this._purchaseService.getAllCompras();
      
      res.status(200).json({
        message: 'Compras obtidas com sucesso',
        data: { compras }
      });
    } catch (error) {
      console.error('Erro ao obter compras:', error);
      
      res.status(500).json({
        error: 'Erro interno do servidor',
        message: 'Falha ao obter lista de compras'
      });
    }
  };
}
