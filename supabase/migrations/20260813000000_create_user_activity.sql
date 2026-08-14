create table if not exists public.user_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  action text not null,
  target text not null,
  entity_type text not null,
  entity_id text,
  xp integer not null default 0,
  icon text not null default 'Activity',
  created_at timestamptz not null default now()
);
create index if not exists user_activity_user_created_idx on public.user_activity(user_id, created_at desc);
alter table public.user_activity enable row level security;
create policy "Users read their activity" on public.user_activity for select to authenticated using (auth.uid() = user_id);
create policy "Users create their activity" on public.user_activity for insert to authenticated with check (auth.uid() = user_id);
