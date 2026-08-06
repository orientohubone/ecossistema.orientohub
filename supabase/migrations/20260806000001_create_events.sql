create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  type text not null check (type in ('mentoria', 'workshop', 'evento', 'reuniao')),
  date timestamptz not null,
  duration text not null,
  description text,
  location text,
  is_virtual boolean not null default false,
  meeting_url text,
  max_participants integer,
  current_participants integer not null default 0,
  mentor_id uuid,
  mentor_name text,
  mentor_avatar text,
  created_at timestamptz not null default now()
);

create index if not exists events_user_date_idx on public.events(user_id, date);

alter table public.events enable row level security;

create policy "Users can read their own events"
  on public.events for select to authenticated
  using (auth.uid() = user_id);

create policy "Users can create their own events"
  on public.events for insert to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own events"
  on public.events for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own events"
  on public.events for delete to authenticated
  using (auth.uid() = user_id);
