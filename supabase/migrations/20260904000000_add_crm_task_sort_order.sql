alter table public.crm_tasks
  add column if not exists sort_order integer not null default 0;

with ordered_tasks as (
  select id, row_number() over (partition by client_id order by created_at, id) - 1 as new_order
  from public.crm_tasks
)
update public.crm_tasks
set sort_order = ordered_tasks.new_order
from ordered_tasks
where public.crm_tasks.id = ordered_tasks.id;

create index if not exists crm_tasks_client_sort_order_idx
  on public.crm_tasks(client_id, sort_order);
