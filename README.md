# 🛍️ GitHub Shoppers — Fullstack Application

Este repositório contém a aplicação completa **GitHub Shoppers**, desenvolvida como parte de um desafio técnico para a vaga de Desenvolvedor AI Code / Automações & Agentes AI.  
A aplicação é composta por **frontend (React)** e **backend (Node.js + TypeScript)** organizados em um monorepo.

---

## 📂 Estrutura do Repositório

```
/
├── backend/    → API RESTful em Node.js + TypeScript
└── frontend/   → Aplicação web em React + Vite
```

---

## 🚀 Tecnologias Principais

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL (via `pg`)
- JWT + bcryptjs
- Jest + Supertest

### Frontend
- React 18 + Vite + TypeScript
- Ant Design + Shadcn/ui + Tailwind CSS
- React Router DOM
- Axios + TanStack Query
- React Hook Form + Zod

---

## 📦 Pré-requisitos

- **Node.js** v16+
- **npm**
- **PostgreSQL** (local ou Supabase)

---

## ⚙️ Configuração do Projeto

### 1. Clonar o repositório
```bash
git clone <URL_DO_REPOSITORIO>
cd <NOME_DO_REPOSITORIO>
```

---

### 2. Configurar o **Backend**

```bash
cd backend
npm install
```

Crie o arquivo `.env`:
```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=sua_senha
DB_NAME=github_shoppers
JWT_SECRET=umsegredoseguro
```

Suba o banco PostgreSQL e rode os scripts/migrations necessários.

Para iniciar:
```bash
npm run dev
```

O backend estará disponível em:  
👉 `http://localhost:3000`

---

### 3. Configurar o **Frontend**

Em outro terminal:
```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em:  
👉 `http://localhost:5173` (ou porta indicada no terminal)

> A URL da API está configurada para `http://localhost:3000` por padrão.

---

## 🧪 Testes

Para rodar os testes do backend:
```bash
cd backend
npm test
```

---

## 📌 Funcionalidades Principais

- Registro e login de usuários com JWT
- Gerenciamento de catálogo de produtos (CRUD)
- Simulação de compras com decremento atômico de estoque
- Integração com GitHub API para gerar comprador aleatório
- UI moderna e responsiva com React + Ant Design
- Histórico de compras com JOIN dos dados de itens

---

## 📝 Extras

- Estrutura modular (Repository → Service → Controller)
- Uso de transações no fluxo de compra
- Testes automatizados backend
- Configuração pronta para documentação com Swagger (opcional)

---

## 📄 Licença

Este projeto foi desenvolvido exclusivamente para fins de avaliação técnica.

✍️ **Autor:** Rodrigo  
📅 **Data:** Outubro de 2025
