create table if not exists public.community_post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  author_name text not null,
  author_avatar text not null default '',
  author_role text not null default 'Membro',
  content text not null check (char_length(trim(content)) between 1 and 2000),
  created_at timestamptz not null default now()
);

alter table public.community_post_comments enable row level security;

drop policy if exists "Authenticated users can read community comments" on public.community_post_comments;
create policy "Authenticated users can read community comments"
  on public.community_post_comments for select to authenticated using (true);

drop policy if exists "Users can create their own community comments" on public.community_post_comments;
create policy "Users can create their own community comments"
  on public.community_post_comments for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own community comments" on public.community_post_comments;
create policy "Users can delete their own community comments"
  on public.community_post_comments for delete to authenticated using (auth.uid() = user_id);

create index if not exists community_post_comments_post_id_idx
  on public.community_post_comments (post_id, created_at asc);

create or replace function public.sync_community_post_comments_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.community_posts set comments_count = comments_count + 1 where id = new.post_id;
    return new;
  end if;

  update public.community_posts set comments_count = greatest(comments_count - 1, 0) where id = old.post_id;
  return old;
end;
$$;

drop trigger if exists community_post_comments_count_trigger on public.community_post_comments;
create trigger community_post_comments_count_trigger
after insert or delete on public.community_post_comments
for each row execute function public.sync_community_post_comments_count();
