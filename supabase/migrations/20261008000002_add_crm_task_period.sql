alter table public.crm_tasks
  add column if not exists starts_at timestamptz,
  add column if not exists ends_at timestamptz;

update public.crm_tasks
set ends_at = due_at
where ends_at is null and due_at is not null;

create index if not exists crm_tasks_period_idx
  on public.crm_tasks(deal_id, starts_at, ends_at)
  where completed = false;

comment on column public.crm_tasks.starts_at is 'Data e horário previstos para início da atividade.';
comment on column public.crm_tasks.ends_at is 'Data e horário previstos para conclusão da atividade.';
