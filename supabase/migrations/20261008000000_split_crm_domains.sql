-- Separa o CRM legado (crm_clients) em empresas, contatos e negociações.
-- A tabela antiga permanece intacta durante a transição para permitir rollback.

create table if not exists public.crm_companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  normalized_name text generated always as (lower(trim(name))) stored,
  segment text,
  website text,
  summary text,
  address text,
  owner_id uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (normalized_name)
);

create table if not exists public.crm_contacts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.crm_companies(id) on delete set null,
  name text not null,
  role text,
  email text,
  phone text,
  whatsapp_username text,
  communication_consent text not null default 'not_informed'
    check (communication_consent in ('not_informed', 'authorized', 'revoked')),
  owner_id uuid references auth.users(id) on delete set null default auth.uid(),
  legacy_client_id uuid unique references public.crm_clients(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crm_deals (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.crm_companies(id) on delete set null,
  primary_contact_id uuid references public.crm_contacts(id) on delete set null,
  name text not null,
  source text not null default 'manual',
  campaign text,
  stage text not null default 'novo'
    check (stage in ('novo', 'qualificando', 'proposta', 'negociação', 'ganho', 'perdido')),
  status text not null default 'open'
    check (status in ('open', 'won', 'lost')),
  estimated_value numeric(12,2),
  demand text,
  services text[] not null default '{}',
  next_step text,
  next_contact_on date,
  last_contact_at timestamptz,
  closed_at timestamptz,
  lost_reason text,
  owner_id uuid references auth.users(id) on delete set null default auth.uid(),
  legacy_client_id uuid unique references public.crm_clients(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crm_deal_contacts (
  deal_id uuid not null references public.crm_deals(id) on delete cascade,
  contact_id uuid not null references public.crm_contacts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (deal_id, contact_id)
);

alter table public.crm_tasks
  add column if not exists deal_id uuid references public.crm_deals(id) on delete cascade,
  add column if not exists description text,
  add column if not exists assigned_to uuid references auth.users(id) on delete set null,
  add column if not exists task_type text not null default 'task',
  add column if not exists due_at timestamptz;

alter table public.crm_notes
  add column if not exists deal_id uuid references public.crm_deals(id) on delete cascade;

create index if not exists crm_companies_name_idx on public.crm_companies(normalized_name);
create index if not exists crm_contacts_company_idx on public.crm_contacts(company_id);
create index if not exists crm_contacts_name_idx on public.crm_contacts(lower(name));
create index if not exists crm_deals_stage_idx on public.crm_deals(stage, created_at desc);
create index if not exists crm_deals_company_idx on public.crm_deals(company_id);
create index if not exists crm_tasks_deal_idx on public.crm_tasks(deal_id, completed, due_at);

-- Cria empresas a partir dos nomes existentes, sem duplicar por caixa/espaços.
insert into public.crm_companies (name, address, created_at, updated_at)
select
  min(trim(company)) as name,
  max(nullif(trim(address), '')) as address,
  min(created_at) as created_at,
  now() as updated_at
from public.crm_clients
where nullif(trim(company), '') is not null
group by lower(trim(company))
on conflict (normalized_name) do update
set address = coalesce(public.crm_companies.address, excluded.address),
    updated_at = now();

-- Cada registro legado vira um contato, mantendo o vínculo de origem.
insert into public.crm_contacts (company_id, name, email, phone, legacy_client_id, created_at, updated_at)
select company.id, client.name, client.email, client.phone, client.id, client.created_at, now()
from public.crm_clients client
left join public.crm_companies company on company.normalized_name = lower(trim(client.company))
on conflict (legacy_client_id) do nothing;

-- Cada oportunidade legada vira uma negociação e preserva a etapa atual.
insert into public.crm_deals (
  company_id, primary_contact_id, name, source, stage, status, estimated_value,
  demand, services, next_step, next_contact_on, last_contact_at,
  legacy_client_id, created_at, updated_at
)
select
  contact.company_id,
  contact.id,
  client.name,
  client.source,
  client.stage,
  case client.stage when 'ganho' then 'won' when 'perdido' then 'lost' else 'open' end,
  client.estimated_value,
  client.demand,
  coalesce(client.services, '{}'),
  client.next_step,
  client.next_contact_on,
  client.last_contact_at,
  client.id,
  client.created_at,
  coalesce(client.updated_at, client.created_at)
from public.crm_clients client
join public.crm_contacts contact on contact.legacy_client_id = client.id
on conflict (legacy_client_id) do nothing;

insert into public.crm_deal_contacts (deal_id, contact_id)
select deal.id, deal.primary_contact_id
from public.crm_deals deal
where deal.primary_contact_id is not null
on conflict do nothing;

update public.crm_tasks task
set deal_id = deal.id
from public.crm_deals deal
where task.deal_id is null and deal.legacy_client_id = task.client_id;

update public.crm_notes note
set deal_id = deal.id
from public.crm_deals deal
where note.deal_id is null and deal.legacy_client_id = note.client_id;

alter table public.crm_companies enable row level security;
alter table public.crm_contacts enable row level security;
alter table public.crm_deals enable row level security;
alter table public.crm_deal_contacts enable row level security;

drop policy if exists "Founder manages CRM companies" on public.crm_companies;
create policy "Founder manages CRM companies" on public.crm_companies for all to authenticated
using ((select auth.jwt() ->> 'email') = 'fersouluramal@gmail.com')
with check ((select auth.jwt() ->> 'email') = 'fersouluramal@gmail.com');

drop policy if exists "Founder manages CRM contacts" on public.crm_contacts;
create policy "Founder manages CRM contacts" on public.crm_contacts for all to authenticated
using ((select auth.jwt() ->> 'email') = 'fersouluramal@gmail.com')
with check ((select auth.jwt() ->> 'email') = 'fersouluramal@gmail.com');

drop policy if exists "Founder manages CRM deals" on public.crm_deals;
create policy "Founder manages CRM deals" on public.crm_deals for all to authenticated
using ((select auth.jwt() ->> 'email') = 'fersouluramal@gmail.com')
with check ((select auth.jwt() ->> 'email') = 'fersouluramal@gmail.com');

drop policy if exists "Founder manages CRM deal contacts" on public.crm_deal_contacts;
create policy "Founder manages CRM deal contacts" on public.crm_deal_contacts for all to authenticated
using ((select auth.jwt() ->> 'email') = 'fersouluramal@gmail.com')
with check ((select auth.jwt() ->> 'email') = 'fersouluramal@gmail.com');

comment on table public.crm_clients is 'Tabela legada mantida temporariamente para rollback da migração do CRM.';
comment on table public.crm_deals is 'Negociações comerciais independentes de empresas e contatos.';
