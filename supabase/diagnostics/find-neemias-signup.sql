-- Read-only. Run in the SQL Editor of the SAME Supabase project used by the app.
-- No matching row means this project does not contain a matching signup/name;
-- do not create a duplicate account to make the founder dashboard display it.
select
  id,
  coalesce(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name') as registered_name,
  email,
  created_at,
  email_confirmed_at,
  last_sign_in_at
from auth.users
where coalesce(raw_user_meta_data->>'full_name', '') ilike '%neemias%'
   or coalesce(raw_user_meta_data->>'name', '') ilike '%neemias%'
   or coalesce(email, '') ilike '%neemias%'
order by created_at desc;
