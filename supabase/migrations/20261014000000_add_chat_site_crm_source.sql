-- Distingue mensagens do chat guiado das mensagens do formulário de contato.
alter table public.contact_messages
  add column if not exists source text not null default 'contato';

create index if not exists contact_messages_source_created_idx
  on public.contact_messages(source, created_at desc);

create or replace function public.sync_contact_message_to_crm()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_source text := coalesce(nullif(trim(new.source), ''), 'contato');
  v_legacy_client_id uuid;
  v_company_id uuid;
  v_contact_id uuid;
  v_deal_id uuid;
begin
  insert into public.crm_clients (
    contact_message_id, name, email, phone, company, demand, source
  ) values (
    new.id, new.name, new.email, new.phone, new.company, new.message, v_source
  )
  on conflict (contact_message_id) do update
  set name = excluded.name,
      email = excluded.email,
      phone = excluded.phone,
      company = excluded.company,
      demand = excluded.demand,
      source = excluded.source,
      updated_at = now()
  returning id into v_legacy_client_id;

  if nullif(trim(new.company), '') is not null then
    insert into public.crm_companies (name, updated_at)
    values (trim(new.company), now())
    on conflict (normalized_name) do update set updated_at = now()
    returning id into v_company_id;
  end if;

  insert into public.crm_contacts (
    company_id, name, email, phone, legacy_client_id, updated_at
  ) values (
    v_company_id, new.name, nullif(trim(new.email), ''), nullif(trim(new.phone), ''), v_legacy_client_id, now()
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
    v_company_id, v_contact_id, new.name, v_source, new.subject, 'novo', 'open',
    new.message, v_legacy_client_id, now()
  )
  on conflict (legacy_client_id) do update
  set company_id = excluded.company_id,
      primary_contact_id = excluded.primary_contact_id,
      source = excluded.source,
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

comment on column public.contact_messages.source is
  'Origem pública da mensagem: contato para o formulário e chat_site para o chat guiado.';
