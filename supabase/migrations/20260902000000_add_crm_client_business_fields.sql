alter table public.crm_clients
  add column if not exists cnpj text,
  add column if not exists address text,
  add column if not exists services text[] not null default '{}';

comment on column public.crm_clients.cnpj is 'CNPJ informado no cadastro comercial.';
comment on column public.crm_clients.address is 'Endereço comercial em formato livre.';
comment on column public.crm_clients.services is 'Slugs dos serviços de interesse vinculados ao cliente.';
