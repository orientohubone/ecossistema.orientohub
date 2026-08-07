insert into public.feature_flags (key, name, description, enabled) values
  ('frameworks_access', 'Frameworks', 'Controla o acesso à biblioteca e aos jogos de frameworks.', true),
  ('academy_access', 'Oriento Academy', 'Controla o acesso à Oriento Academy.', true)
on conflict (key) do update set
  name = excluded.name,
  description = excluded.description;
