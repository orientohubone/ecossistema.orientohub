import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) throw new Error('Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.');

export const supabase = createClient(url, anonKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce' },
  global: { headers: { 'x-application-name': 'orientohub-crm' } },
});

export const CRM_ALLOWED_EMAIL = 'fersouluramal@gmail.com';
