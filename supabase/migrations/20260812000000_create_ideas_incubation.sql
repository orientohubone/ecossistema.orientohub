create table if not exists public.ideas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  audience text,
  problem text,
  proposed_solution text,
  evidence text,
  curation_notes text,
  stage text not null default 'capture' check (stage in ('capture', 'discovery', 'validation', 'incubation', 'ready', 'archived')),
  curation_score integer not null default 0 check (curation_score between 0 and 100),
  promoted_project_id uuid null references public.projects(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.idea_hypotheses (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid not null references public.ideas(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  statement text not null,
  evidence text,
  status text not null default 'open' check (status in ('open', 'testing', 'validated', 'invalidated')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ideas_user_stage_idx on public.ideas(user_id, stage);
create index if not exists idea_hypotheses_idea_idx on public.idea_hypotheses(idea_id);
alter table public.ideas enable row level security;
alter table public.idea_hypotheses enable row level security;

create policy "Users manage their ideas" on public.ideas for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage their idea hypotheses" on public.idea_hypotheses for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
