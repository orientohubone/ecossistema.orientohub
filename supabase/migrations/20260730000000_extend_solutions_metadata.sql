-- Complementa a tabela de soluções para permitir a promoção de projetos.
-- A migração é idempotente para funcionar em bancos que já possuem algum dos campos.

ALTER TABLE IF EXISTS public.solutions
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS stage text NOT NULL DEFAULT 'Ideação',
  ADD COLUMN IF NOT EXISTS git_url text,
  ADD COLUMN IF NOT EXISTS founder_name text,
  ADD COLUMN IF NOT EXISTS ide_url text,
  ADD COLUMN IF NOT EXISTS database_url text,
  ADD COLUMN IF NOT EXISTS instagram_url text,
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS mrr numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS active_users integer NOT NULL DEFAULT 0;
