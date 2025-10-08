-- Migration: Criar tabela itens
-- Descrição: Tabela para armazenar o catálogo de produtos

CREATE TABLE IF NOT EXISTS itens (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    preco DECIMAL(10,2) NOT NULL CHECK (preco >= 0),
    qtd_atual INTEGER NOT NULL DEFAULT 0 CHECK (qtd_atual >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);