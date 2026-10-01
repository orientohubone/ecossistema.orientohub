alter table public.billing_subscriptions
  add column if not exists provider text not null default 'asaas',
  add column if not exists provider_checkout_id text,
  add column if not exists provider_subscription_id text,
  add column if not exists provider_customer_id text,
  add column if not exists provider_payment_id text;

-- A AbacatePay coleta os dados do comprador no checkout hospedado. Isso permite
-- iniciar a compra pela página pública e associar a assinatura após o pagamento.
alter table public.billing_subscriptions alter column user_id drop not null;

create unique index if not exists billing_subscriptions_provider_checkout_id_idx
  on public.billing_subscriptions(provider, provider_checkout_id)
  where provider_checkout_id is not null;

create index if not exists billing_subscriptions_provider_subscription_id_idx
  on public.billing_subscriptions(provider, provider_subscription_id)
  where provider_subscription_id is not null;
