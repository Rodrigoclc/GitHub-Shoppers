import swaggerJsdoc from "swagger-jsdoc";
import { config } from "dotenv";
config();
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API GitHub Shoppers",
      version: "1.0.0",
      description:
        "API para gerenciamento de produtos e compras, integrada com GitHub.",
    },
    servers: [
      {
        url: "http://localhost:" + (process.env.PORT || 3000),
        description: "Servidor de desenvolvimento",
      }
    ],
    tags: [
      { name: "Itens", description: "Operações relacionadas a itens" },
      { name: "Compras", description: "Operações relacionadas a compras" },
      { name: "Autenticação", description: "Operações de autenticação e usuários" },
    ],
  },
  apis: ["./src/docs/schemas/*.ts"], // Caminhos para os arquivos que contêm anotações JSDoc
};

const specs = swaggerJsdoc(options);

export default specs;
