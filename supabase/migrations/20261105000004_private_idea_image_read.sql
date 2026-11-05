begin;
-- Compatible repair for environments that had uploads but no SELECT policy.
-- Never restore a public bucket to fix a private image.
update storage.buckets set public = false where id = 'idea-images';
drop policy if exists "Private idea image read" on storage.objects;
create policy "Private idea image read" on storage.objects for select to authenticated
  using (bucket_id = 'idea-images' and auth.uid() is not null and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "Private idea image boundary" on storage.objects;
create policy "Private idea image boundary" on storage.objects as restrictive for all to public
  using (bucket_id <> 'idea-images' or (auth.uid() is not null and (storage.foldername(name))[1] = auth.uid()::text))
  with check (bucket_id <> 'idea-images' or (auth.uid() is not null and (storage.foldername(name))[1] = auth.uid()::text));
commit;
