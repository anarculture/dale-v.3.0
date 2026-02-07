import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Lazy singleton - only creates client when accessed
let _supabase: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (_supabase) return _supabase;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    // During build/SSG or if env vars are missing, log a warning instead of crashing
    console.warn('Missing Supabase environment variables. Features requiring Supabase will not work.');
    
    // Return a dummy client that satisfies the interface but does nothing/logs warnings
    // We cast to SupabaseClient to avoid implementing the entire massive interface
    // This allows the app to load even if Supabase is misconfigured
    return new Proxy({} as SupabaseClient, {
      get(_target, prop) {
        // Allow 'auth' to be accessed so auth.getSession() calls don't crash top-level code
        if (prop === 'auth') {
          return {
            getSession: async () => ({ data: { session: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
            signUp: async () => ({ error: { message: 'Supabase not configured' } }),
            signInWithPassword: async () => ({ error: { message: 'Supabase not configured' } }),
            signOut: async () => ({}),
            resetPasswordForEmail: async () => ({ error: { message: 'Supabase not configured' } }),
          };
        }
        
        // Return a function that logs a warning for any other method call
        return () => {
          console.warn(`Attempted to call Supabase command "${String(prop)}" but Supabase is not configured.`);
          return { data: null, error: { message: 'Supabase environment variables missing' } };
        };
      }
    });
  }
  
  _supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
  
  return _supabase;
}

// Proxy that lazily initializes supabase on first access
// This prevents the error from being thrown at import time
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop: keyof SupabaseClient) {
    return getSupabaseClient()[prop];
  },
});
