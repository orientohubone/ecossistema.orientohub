begin;

-- Community is included in Free; feature flags and explicit rules still govern availability.
update public.plan_entitlements
set premium_community=true,updated_at=now()
where plan='free';

-- Preserve the existing key and all rules that reference it.
update public.feature_flags
set name='Comunidade',
    description='Acesso à comunidade para todos os planos, incluindo o Free.'
where key='premium_community';

commit;
