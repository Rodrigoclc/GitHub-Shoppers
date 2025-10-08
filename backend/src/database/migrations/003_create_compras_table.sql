-- Migration: Criar tabela compras
-- Descrição: Tabela para armazenar o histórico de compras realizadas

CREATE TABLE IF NOT EXISTS compras (
    id SERIAL PRIMARY KEY,
    item_id INTEGER NOT NULL REFERENCES itens(id) ON DELETE CASCADE,
    comprador_github_login VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);