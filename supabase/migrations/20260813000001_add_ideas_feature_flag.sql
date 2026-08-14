-- Ideias é uma área-base da plataforma: disponível sem limite em todos os planos.
-- A flag existe para permitir comunicação de manutenção, desenvolvimento e regras futuras.
insert into public.feature_flags (key, name, description, enabled) values
  ('ideas_access', 'Ideias', 'Acesso ilimitado à captura, curadoria e incubação de ideias em todos os planos.', true)
on conflict (key) do update set
  name = excluded.name,
  description = excluded.description,
  enabled = true,
  updated_at = now();
