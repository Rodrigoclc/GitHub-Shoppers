import { Request, Response } from "express";
import { IPurchaseService } from "../interfaces/services/IPurchaseService";
import { CreatePurchaseDto } from "../dto/createPurchaseDto";
import { IApiResponse } from "../interfaces/IApiResponse";

export class PurchaseController {
  private _purchaseService: IPurchaseService;

  constructor(purchaseService: IPurchaseService) {
    this._purchaseService = purchaseService;
  }

  create = async (req: Request, res: Response): Promise<void> => {
    let response: IApiResponse = { message: "" };
    try {
      const compraData: CreatePurchaseDto = req.body;

      const compra = await this._purchaseService.createPurchase(compraData);

      response.message = "Compra realizada com sucesso";
      response.data = { compra };
      res.status(201).json(response);
    } catch (error) {
      console.error("Erro ao criar compra:", error);

      if (error instanceof Error) {
        // Verificar se é erro de estoque (status 409)
        if (
          (error as any).statusCode === 409 ||
          error.message === "Item fora de estoque."
        ) {
          response.error = "Item fora de estoque";
          response.message = "Item fora de estoque.";
          res.status(409).json(response);
          return;
        }

        if (error.message === "Item não encontrado") {
          response.error = "Item não encontrado";
          response.message = error.message;
          res.status(404).json(response);
          return;
        }

        if (error.message.includes("GitHub")) {
          response.error = "Serviço indisponível";
          response.message =
            "Falha temporária na integração com GitHub. Tente novamente.";
          res.status(503).json(response);
          return;
        }
      }
      response.error = "Erro interno do servidor";
      response.message = "Falha ao processar compra";
      res.status(500).json(response);
    }
  };

  getAll = async (req: Request, res: Response): Promise<void> => {
    let response: IApiResponse = { message: "" };
    try {
      const compras = await this._purchaseService.getAllCompras();

      response.message = "Compras obtidas com sucesso";
      response.data = { compras };
      res.status(200).json(response);
    } catch (error) {
      console.error("Erro ao obter compras:", error);

      response.error = "Erro interno do servidor";
      response.message = "Falha ao obter lista de compras";
      res.status(500).json(response);
    }
  };
}
