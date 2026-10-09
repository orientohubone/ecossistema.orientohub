alter table public.crm_tasks
  add column if not exists task_status text not null default 'pending'
  check (task_status in ('pending', 'in_progress', 'waiting_client', 'completed'));

update public.crm_tasks
set task_status = case when completed then 'completed' else 'pending' end
where task_status is null
   or (completed and task_status <> 'completed');

create index if not exists crm_tasks_deal_status_order_idx
  on public.crm_tasks(deal_id, task_status, sort_order);

comment on column public.crm_tasks.task_status is
  'Estado operacional da tarefa: pending, in_progress, waiting_client ou completed.';
