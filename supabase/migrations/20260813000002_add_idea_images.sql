alter table public.ideas
  add column if not exists image_urls text[] not null default '{}';

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('idea-images', 'idea-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update set
  public = true,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Users upload their own idea images" on storage.objects;
create policy "Users upload their own idea images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'idea-images' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Users manage their own idea images" on storage.objects;
create policy "Users manage their own idea images"
  on storage.objects for update to authenticated
  using (bucket_id = 'idea-images' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'idea-images' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Users delete their own idea images" on storage.objects;
create policy "Users delete their own idea images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'idea-images' and (storage.foldername(name))[1] = auth.uid()::text);
