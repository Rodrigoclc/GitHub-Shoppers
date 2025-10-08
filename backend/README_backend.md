# 🛍️ GitHub Shoppers – Backend

Este é o backend do desafio técnico para a vaga de **Desenvolvedor AI Code / Automações & Agentes AI** da Montree Tecnologia.  
O projeto implementa uma **API RESTful** em **Node.js + TypeScript**, com arquitetura em camadas (Controller → Service → Repository) e acesso direto ao **PostgreSQL** via SQL nativo (`pg`), sem ORM.

---

## 🚀 **Tecnologias Utilizadas**

- **Node.js** + **Express** — Servidor HTTP rápido e simples.  
- **TypeScript** — Tipagem forte e melhor manutenção do código.  
- **pg** — Driver oficial para PostgreSQL, permitindo uso direto de SQL.  
- **JWT (jsonwebtoken)** — Autenticação por token.  
- **bcryptjs** — Hash de senhas.  
- **dotenv** — Variáveis de ambiente.  
- **Jest + Supertest** — Testes automatizados de integração.  
- **CORS** — Configurado para permitir requisições do frontend.  

---

## 🧱 **Arquitetura**

```
backend/
 ├── src
 │   ├── config         → conexão com DB e configs globais
 │   ├── entities       → interfaces das entidades (User, Item, Purchase)
 │   ├── repositories   → interfaces + implementações SQL puras
 │   ├── services       → regras de negócio e integrações externas
 │   ├── controllers    → tratam requisições HTTP
 │   ├── middlewares    → autenticação, etc.
 │   ├── routes         → definição de rotas da API
 │   ├── tests          → testes automatizados
 │   ├── app.ts
 │   └── server.ts
 ├── .env
 ├── tsconfig.json
 ├── package.json
 ├── jest.config.js
 └── README.md
```

---

## ⚙️ **Configuração do Ambiente**

### 1. Clonar o repositório
```bash
git clone <URL_DO_REPOSITORIO>
cd backend
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do backend:

```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=sua_senha
DB_NAME=github_shoppers
JWT_SECRET=umsegredoseguro
```

---

## 🛠️ **Banco de Dados**

O banco utilizado é **PostgreSQL (Supabase)**.  
Toda a estrutura é gerenciada via **migrations** SQL (ou `pg`), sem uso de ORM.

Tabelas utilizadas:

- **usuarios**  
  - `id`, `email`, `password_hash`, `created_at`, `updated_at`

- **itens**  
  - `id`, `nome`, `preco`, `qtd_atual`, `created_at`, `updated_at`

- **compras**  
  - `id`, `item_id` (FK), `comprador_github_login`, `created_at`, `updated_at`

> Para criar o banco localmente, crie manualmente a database e rode os scripts SQL de criação na pasta de migrations.

---

## ▶️ **Rodando o Servidor**

```bash
npm run dev
```

O servidor iniciará por padrão em `http://localhost:3000`.

---

## 🌐 **Endpoints**

### Autenticação (`/auth`)
- `POST /auth/register` — Cadastra um novo usuário.  
- `POST /auth/login` — Faz login e retorna token JWT.

### Itens (`/itens`) *(rotas protegidas)*
- `POST /itens` — Cria um novo item.  
- `GET /itens` — Lista todos os itens.

### Compras (`/compras`) *(rotas protegidas)*
- `POST /compras` — Cria uma nova compra.  
  - Verifica estoque, decrementa de forma atômica e busca comprador aleatório na API do GitHub.
- `GET /compras` — Lista todas as compras com JOIN dos dados dos itens.

---

## 🔐 **Autenticação**

As rotas de catálogo e compras exigem autenticação via **JWT**.  
Envie o token no header:
```
Authorization: Bearer <token>
```

---

## 🧪 **Testes Automatizados**

Testes escritos com **Jest + Supertest**, cobrindo:

- Registro e login de usuários  
- Proteção de rotas autenticadas  
- Fluxo de compras com estoque disponível  
- Fluxo de compras sem estoque (erro 409)  
- Decremento atômico de estoque

Para rodar os testes:

```bash
npm test
```

---

## 📝 **Extras Implementados**

- ✅ Uso de **transações** no fluxo de compra para garantir atomicidade.  
- ✅ Integração com **GitHub API** (`https://api.github.com/users`) para obter comprador aleatório.  
- ✅ Estrutura modular e bem tipada (Repository → Service → Controller).  
- ✅ Base pronta para documentação com Swagger (opcional para entrega final).

---

## 📨 **Entrega**

Este backend está preparado conforme o desafio técnico.  
Para executar o sistema completo:
1. Subir o banco PostgreSQL local ou no Supabase  
2. Configurar `.env`  
3. Rodar `npm run dev`  
4. Testar os endpoints no Postman ou via frontend (pasta `/frontend` do repositório)

---

✍️ **Autor:** Rodrigo  
📅 **Data:** Outubro de 2025
