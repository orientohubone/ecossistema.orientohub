alter table public.crm_clients
  add column if not exists next_contact_on date;

comment on column public.crm_clients.next_contact_on is 'Data prevista para o próximo contato comercial.';
