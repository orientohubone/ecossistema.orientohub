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

// Check if projects table exists
export const checkProjectsTable = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('projects')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Projects table check error:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
        userAuthenticated: !!user,
        userId: user?.id
      });
      
      if (error.code === 'PGRST205' || error.code === 'PGRST116') {
        return { 
          exists: false, 
          error: 'Table not found',
          code: error.code,
          message: error.message,
          hint: error.hint
        };
      }
      
      // Check for RLS errors
      if (error.code === '42501' || error.message?.toLowerCase().includes('permission denied')) {
        return {
          exists: true, // Table exists but RLS is blocking
          error: 'Permission denied - RLS policies may be blocking access',
          code: error.code,
          message: error.message,
          hint: error.hint || 'Check RLS policies in Supabase'
        };
      }
      
      return { 
        exists: false, 
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      };
    }
    
    return { exists: true, error: null, count: data };
  } catch (error: any) {
    console.error('Projects table check exception:', error);
    return { 
      exists: false, 
      error: error.message || 'Unknown error',
      exception: true
    };
  }
};

// Comprehensive diagnostic function
export const diagnoseProjectsTable = async () => {
  const diagnostics: Record<string, any> = {
    timestamp: new Date().toISOString(),
    connection: null,
    authentication: null,
    tableExists: null,
    rlsEnabled: null,
    policies: null,
    errors: []
  };

  try {
    // 1. Test connection
    const connectionTest = await testSupabaseConnection();
    diagnostics.connection = connectionTest;

    // 2. Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    diagnostics.authentication = {
      authenticated: !!user,
      userId: user?.id || null,
      email: user?.email || null,
      error: authError?.message || null
    };

    // 3. Check table
    const tableCheck = await checkProjectsTable();
    diagnostics.tableExists = tableCheck;

    // 4. Try to query with detailed error
    if (user) {
      const { data, error } = await supabase
        .from('projects')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .limit(1);

      if (error) {
        diagnostics.errors.push({
          operation: 'select_query',
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
      } else {
        diagnostics.querySuccess = true;
        diagnostics.rowCount = data?.length || 0;
      }
    }

    return diagnostics;
  } catch (error: any) {
    diagnostics.errors.push({
      operation: 'diagnostic',
      error: error.message || 'Unknown error',
      stack: error.stack
    });
    return diagnostics;
  }
};
