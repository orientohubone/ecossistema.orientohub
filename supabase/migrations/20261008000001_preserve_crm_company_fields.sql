-- Preserva dados empresariais do cadastro legado e flexibiliza o vínculo legado
-- de tarefas/anotações para os novos registros criados diretamente no CRM.

alter table public.crm_companies
  add column if not exists cnpj text;

update public.crm_companies company
set
  cnpj = coalesce(company.cnpj, legacy.cnpj),
  address = coalesce(company.address, legacy.address),
  updated_at = now()
from (
  select lower(trim(company)) as normalized_name, max(cnpj) as cnpj, max(address) as address
  from public.crm_clients
  where nullif(trim(company), '') is not null
  group by lower(trim(company))
) legacy
where company.normalized_name = legacy.normalized_name;

alter table public.crm_tasks alter column client_id drop not null;
alter table public.crm_notes alter column client_id drop not null;

comment on column public.crm_companies.cnpj is 'CNPJ da empresa, preservado dos cadastros legados.';
