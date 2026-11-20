create table if not exists public.solution_market_growth (
  solution_id uuid primary key references public.solutions(id) on delete cascade,
  active_audience bigint not null default 0 check (active_audience >= 0),
  mrr numeric(14,2) not null default 0 check (mrr >= 0),
  valuation numeric(16,2) check (valuation is null or valuation >= 0),
  currency text not null default 'BRL' check (currency in ('BRL', 'USD', 'EUR')),
  source text,
  received_at timestamptz not null default now()
);

create table if not exists public.solution_market_growth_webhook_keys (
  solution_id uuid primary key references public.solutions(id) on delete cascade,
  token_hash text not null,
  created_at timestamptz not null default now()
);

alter table public.solution_market_growth enable row level security;
alter table public.solution_market_growth_webhook_keys enable row level security;

drop policy if exists "Owners can read solution market growth" on public.solution_market_growth;
create policy "Owners can read solution market growth"
  on public.solution_market_growth for select to authenticated
  using (exists (select 1 from public.solutions s where s.id = solution_id and s.user_id = (select auth.uid())));

revoke all on public.solution_market_growth_webhook_keys from anon, authenticated;
revoke all on public.solution_market_growth from anon, authenticated;
grant select on public.solution_market_growth to authenticated;
