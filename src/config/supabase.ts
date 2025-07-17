import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'x-application-name': 'orientohub',
    },
  },
});

// Test connection and provide better error handling
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('solutions').select('count', { count: 'exact', head: true });
    if (error && error.code === 'PGRST116') {
      // Table doesn't exist yet, but connection is working
      return { connected: true, tableExists: false };
    }
    return { connected: true, tableExists: true, error: null };
  } catch (error: any) {
    console.error('Supabase connection test failed:', error);
    return { 
      connected: false, 
      tableExists: false, 
      error: error.message || 'Connection failed' 
    };
  }
};