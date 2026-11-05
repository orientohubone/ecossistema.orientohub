-- Read-only diagnosis. No tokens, signed URLs or image content are returned.
select i.id, i.title, u.email as account_email,
  cardinality(i.image_urls) as linked_images,
  (select count(*) from storage.objects o where o.bucket_id='idea-images' and o.name like i.user_id::text || '/' || i.id::text || '/%') as files_in_private_idea_folder,
  b.public as bucket_is_public,
  exists(select 1 from pg_policies p where p.schemaname='storage' and p.tablename='objects' and p.policyname='Private idea image read') as owner_read_policy_exists
from public.ideas i
join auth.users u on u.id=i.user_id
left join storage.buckets b on b.id='idea-images'
where i.title ilike '%ced%'
order by i.created_at desc;
