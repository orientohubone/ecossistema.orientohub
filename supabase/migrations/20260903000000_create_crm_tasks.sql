create table if not exists public.crm_tasks (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.crm_clients(id) on delete cascade,
  title text not null,
  completed boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists crm_tasks_client_id_idx
  on public.crm_tasks(client_id, completed, created_at);

alter table public.crm_tasks enable row level security;

drop policy if exists "Founder manages CRM tasks" on public.crm_tasks;
create policy "Founder manages CRM tasks" on public.crm_tasks
  for all to authenticated
  using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'fersouluramal@gmail.com')
  with check (lower(coalesce(auth.jwt() ->> 'email', '')) = 'fersouluramal@gmail.com');
