create table if not exists public.billing_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan text not null check (plan in ('free', 'pro', 'enterprise')),
  status text not null default 'pending' check (status in ('pending', 'active', 'past_due', 'cancelled', 'expired')),
  billing_cycle text not null check (billing_cycle in ('monthly', 'annual')),
  asaas_checkout_id text unique,
  asaas_subscription_id text unique,
  asaas_customer_id text,
  asaas_payment_id text,
  external_reference text unique not null,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists billing_subscriptions_user_id_idx on public.billing_subscriptions(user_id);
create index if not exists billing_subscriptions_asaas_subscription_id_idx on public.billing_subscriptions(asaas_subscription_id);

alter table public.billing_subscriptions enable row level security;

create policy "Users can view their own subscriptions"
  on public.billing_subscriptions for select
  to authenticated
  using (auth.uid() = user_id);

create or replace function public.set_billing_subscription_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists billing_subscriptions_updated_at on public.billing_subscriptions;
create trigger billing_subscriptions_updated_at
  before update on public.billing_subscriptions
  for each row execute function public.set_billing_subscription_updated_at();
