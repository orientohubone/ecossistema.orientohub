-- CRM comercial do Founder. Contatos públicos entram automaticamente como clientes em potencial.
create table if not exists public.crm_clients (
  id uuid primary key default gen_random_uuid(),
  contact_message_id uuid unique references public.contact_messages(id) on delete set null,
  name text not null,
  email text,
  phone text,
  company text,
  demand text,
  source text not null default 'contato',
  stage text not null default 'novo' check (stage in ('novo', 'qualificando', 'proposta', 'negociação', 'ganho', 'perdido')),
  estimated_value numeric(12,2),
  next_step text,
  last_contact_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crm_notes (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.crm_clients(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists crm_clients_stage_idx on public.crm_clients(stage);
create index if not exists crm_clients_created_at_idx on public.crm_clients(created_at desc);
create index if not exists crm_notes_client_id_idx on public.crm_notes(client_id, created_at desc);

alter table public.crm_clients enable row level security;
alter table public.crm_notes enable row level security;

drop policy if exists "Founder manages CRM clients" on public.crm_clients;
create policy "Founder manages CRM clients" on public.crm_clients
  for all to authenticated
  using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'fersouluramal@gmail.com')
  with check (lower(coalesce(auth.jwt() ->> 'email', '')) = 'fersouluramal@gmail.com');

drop policy if exists "Founder manages CRM notes" on public.crm_notes;
create policy "Founder manages CRM notes" on public.crm_notes
  for all to authenticated
  using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'fersouluramal@gmail.com')
  with check (lower(coalesce(auth.jwt() ->> 'email', '')) = 'fersouluramal@gmail.com');

create or replace function public.sync_contact_message_to_crm()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.crm_clients (contact_message_id, name, email, phone, company, demand, source)
  values (new.id, new.name, new.email, new.phone, new.company, new.message, 'contato')
  on conflict (contact_message_id) do nothing;
  return new;
end;
$$;

drop trigger if exists contact_message_to_crm on public.contact_messages;
create trigger contact_message_to_crm
  after insert on public.contact_messages
  for each row execute function public.sync_contact_message_to_crm();

-- Traz para o CRM todos os contatos que já existiam antes desta migração.
insert into public.crm_clients (contact_message_id, name, email, phone, company, demand, source)
select id, name, email, phone, company, message, 'contato'
from public.contact_messages
on conflict (contact_message_id) do nothing;
