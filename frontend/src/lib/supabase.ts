import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Lazy singleton - only creates client when accessed
let _supabase: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (_supabase) return _supabase;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    // During build/SSG, throw a more specific error that can be caught
    throw new Error('Missing Supabase environment variables. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.');
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
