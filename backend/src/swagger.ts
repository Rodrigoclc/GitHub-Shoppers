import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Exemplo com Swagger",
      version: "1.0.0",
      description:
        "Documentação da minha API REST usando Express e TypeScript.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor de desenvolvimento",
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"], // Caminhos para os arquivos que contêm anotações JSDoc
};

const specs = swaggerJsdoc(options);

export default specs;
