-- Script para adicionar a coluna 'completed' à tabela 'items' no Supabase

-- Este script deve ser executado no SQL Editor do Supabase

ALTER TABLE items
ADD COLUMN IF NOT EXISTS completed BOOLEAN DEFAULT FALSE;

-- Após executar este script, reinicie o servidor de desenvolvimento
-- e tente adicionar um item novamente.