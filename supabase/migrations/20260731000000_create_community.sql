-- Community feed: public authenticated posts and per-user interactions.
create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  author_name text not null,
  author_avatar text not null default '',
  author_role text not null default 'Membro',
  title text not null check (char_length(trim(title)) between 3 and 180),
  content text not null check (char_length(trim(content)) between 1 and 10000),
  category text not null default 'discussion' check (category in ('discussion', 'question', 'showcase', 'announcement')),
  tags text[] not null default '{}',
  likes_count integer not null default 0 check (likes_count >= 0),
  comments_count integer not null default 0 check (comments_count >= 0),
  views_count integer not null default 0 check (views_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.community_post_likes (
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table if not exists public.community_post_bookmarks (
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

alter table public.community_posts enable row level security;
alter table public.community_post_likes enable row level security;
alter table public.community_post_bookmarks enable row level security;

drop policy if exists "Authenticated users can read community posts" on public.community_posts;
create policy "Authenticated users can read community posts"
  on public.community_posts for select to authenticated using (true);

drop policy if exists "Users can create their own community posts" on public.community_posts;
create policy "Users can create their own community posts"
  on public.community_posts for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "Users can update their own community posts" on public.community_posts;
create policy "Users can update their own community posts"
  on public.community_posts for update to authenticated using (auth.uid() = user_id);

drop policy if exists "Users can delete their own community posts" on public.community_posts;
create policy "Users can delete their own community posts"
  on public.community_posts for delete to authenticated using (auth.uid() = user_id);

drop policy if exists "Authenticated users can read community likes" on public.community_post_likes;
create policy "Authenticated users can read community likes"
  on public.community_post_likes for select to authenticated using (true);

drop policy if exists "Users can manage their own community likes" on public.community_post_likes;
create policy "Users can manage their own community likes"
  on public.community_post_likes for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Authenticated users can read community bookmarks" on public.community_post_bookmarks;
create policy "Authenticated users can read community bookmarks"
  on public.community_post_bookmarks for select to authenticated using (true);

drop policy if exists "Users can manage their own community bookmarks" on public.community_post_bookmarks;
create policy "Users can manage their own community bookmarks"
  on public.community_post_bookmarks for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists community_posts_created_at_idx on public.community_posts (created_at desc);
create index if not exists community_posts_category_idx on public.community_posts (category);
create index if not exists community_post_likes_user_idx on public.community_post_likes (user_id);
create index if not exists community_post_bookmarks_user_idx on public.community_post_bookmarks (user_id);

create or replace function public.toggle_community_post_like(p_post_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  liked boolean;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if exists (
    select 1 from public.community_post_likes
    where post_id = p_post_id and user_id = auth.uid()
  ) then
    delete from public.community_post_likes where post_id = p_post_id and user_id = auth.uid();
    update public.community_posts set likes_count = greatest(likes_count - 1, 0) where id = p_post_id;
    liked := false;
  else
    insert into public.community_post_likes (post_id, user_id) values (p_post_id, auth.uid());
    update public.community_posts set likes_count = likes_count + 1 where id = p_post_id;
    liked := true;
  end if;

  return liked;
end;
$$;

create or replace function public.toggle_community_post_bookmark(p_post_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  bookmarked boolean;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if exists (
    select 1 from public.community_post_bookmarks
    where post_id = p_post_id and user_id = auth.uid()
  ) then
    delete from public.community_post_bookmarks where post_id = p_post_id and user_id = auth.uid();
    bookmarked := false;
  else
    insert into public.community_post_bookmarks (post_id, user_id) values (p_post_id, auth.uid());
    bookmarked := true;
  end if;

  return bookmarked;
end;
$$;

revoke all on function public.toggle_community_post_like(uuid) from public;
grant execute on function public.toggle_community_post_like(uuid) to authenticated;
revoke all on function public.toggle_community_post_bookmark(uuid) from public;
grant execute on function public.toggle_community_post_bookmark(uuid) to authenticated;
