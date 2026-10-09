-- Mantém o formulário público de contato sincronizado com o CRM separado.
-- Também recupera mensagens que entraram depois do split e antes desta correção.

create or replace function public.sync_contact_message_to_crm()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_legacy_client_id uuid;
  v_company_id uuid;
  v_contact_id uuid;
  v_deal_id uuid;
begin
  insert into public.crm_clients (
    contact_message_id, name, email, phone, company, demand, source
  ) values (
    new.id, new.name, new.email, new.phone, new.company, new.message, 'contato'
  )
  on conflict (contact_message_id) do update
  set name = excluded.name,
      email = excluded.email,
      phone = excluded.phone,
      company = excluded.company,
      demand = excluded.demand,
      updated_at = now()
  returning id into v_legacy_client_id;

  if nullif(trim(new.company), '') is not null then
    insert into public.crm_companies (name, updated_at)
    values (trim(new.company), now())
    on conflict (normalized_name) do update
    set updated_at = now()
    returning id into v_company_id;
  end if;

  insert into public.crm_contacts (
    company_id, name, email, phone, legacy_client_id, updated_at
  ) values (
    v_company_id, new.name, new.email, new.phone, v_legacy_client_id, now()
  )
  on conflict (legacy_client_id) do update
  set company_id = excluded.company_id,
      name = excluded.name,
      email = excluded.email,
      phone = excluded.phone,
      updated_at = now()
  returning id into v_contact_id;

  insert into public.crm_deals (
    company_id, primary_contact_id, name, source, campaign, stage, status,
    demand, legacy_client_id, updated_at
  ) values (
    v_company_id, v_contact_id, new.name, 'contato', new.subject, 'novo', 'open',
    new.message, v_legacy_client_id, now()
  )
  on conflict (legacy_client_id) do update
  set company_id = excluded.company_id,
      primary_contact_id = excluded.primary_contact_id,
      campaign = excluded.campaign,
      demand = excluded.demand,
      updated_at = now()
  returning id into v_deal_id;

  insert into public.crm_deal_contacts (deal_id, contact_id)
  values (v_deal_id, v_contact_id)
  on conflict do nothing;

  return new;
end;
$$;

drop trigger if exists contact_message_to_crm on public.contact_messages;
create trigger contact_message_to_crm
  after insert on public.contact_messages
  for each row execute function public.sync_contact_message_to_crm();

-- Backfill de empresas que chegaram à tabela legada depois da migração de split.
insert into public.crm_companies (name, created_at, updated_at)
select min(trim(company)), min(created_at), now()
from public.crm_clients
where nullif(trim(company), '') is not null
group by lower(trim(company))
on conflict (normalized_name) do update set updated_at = now();

-- Backfill de contatos ainda ausentes no novo domínio.
insert into public.crm_contacts (
  company_id, name, email, phone, legacy_client_id, created_at, updated_at
)
select company.id, client.name, client.email, client.phone, client.id, client.created_at, now()
from public.crm_clients client
left join public.crm_companies company
  on company.normalized_name = lower(trim(client.company))
on conflict (legacy_client_id) do nothing;

-- Backfill das negociações ainda ausentes no novo pipeline.
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

comment on function public.sync_contact_message_to_crm() is
  'Sincroniza mensagens do formulário público com cliente legado, empresa, contato e negociação do CRM atual.';
