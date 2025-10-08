import { Request, Response } from "express";
import { IProductService } from "../interfaces/services/IProductService";
import { CreateProductDto } from "../dto/CreateProductDto";
import { IApiResponse } from "../interfaces/IApiResponse";

export class ProductController {
  private _productService: IProductService;

  constructor(productService: IProductService) {
    this._productService = productService;
  }

  create = async (req: Request, res: Response): Promise<void> => {
    let response: IApiResponse = { message: "" };
    try {
      const itemData: CreateProductDto = req.body;

      const item = await this._productService.createItem(itemData);

      response.message = "Item criado com sucesso";
      response.data = { item };
      res.status(201).json(response);
    } catch (error) {
      console.error("Erro ao criar item:", error);

      if (error instanceof Error) {
        if (error.message === "Já existe um item com este nome") {
          response.error = "Conflito";
          response.message = error.message;
          res.status(409).json(response);
          return;
        }

        if (
          error.message.includes("deve ser maior que zero") ||
          error.message.includes("não pode ser negativa")
        ) {
          response.error = "Dados inválidos";
          response.message = error.message;
          res.status(400).json(response);
          return;
        }
      }
      response.error = "Erro interno do servidor";
      response.message = "Falha ao criar item";
      res.status(500).json(response);
    }
  };

  getAll = async (req: Request, res: Response): Promise<void> => {
    let response: IApiResponse = { message: "" };
    try {
      const items = await this._productService.getAllItems();

      response.message = "Itens obtidos com sucesso";
      response.data = { items };
      res.status(200).json(response);
    } catch (error) {
      console.error("Erro ao obter itens:", error);

      response.error = "Erro interno do servidor";
      response.message = "Falha ao obter lista de itens";
      res.status(500).json(response);
    }
  };
}
