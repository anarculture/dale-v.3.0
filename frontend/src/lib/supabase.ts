import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Lazy singleton - only creates client when accessed
let _supabase: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (_supabase) return _supabase;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    // At runtime (in the browser), missing env vars is a hard error — fail fast
    // so developers see a clear message instead of silent auth failures.
    if (typeof window !== 'undefined') {
      throw new Error(
        'Missing Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY). ' +
        'Check your .env.local file or Vercel environment config.'
      );
    }

    // During build-time SSG (server, no window), return a no-op dummy so
    // static page generation doesn't crash.
    console.warn('Missing Supabase environment variables — using build-time dummy client.');
    return new Proxy({} as SupabaseClient, {
      get(_target, prop) {
        if (prop === 'auth') {
          return {
            getSession: async () => ({ data: { session: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
            signUp: async () => ({ data: null, error: null }),
            signInWithPassword: async () => ({ data: null, error: null }),
            signOut: async () => ({}),
            resetPasswordForEmail: async () => ({ data: null, error: null }),
          };
        }
        return () => ({ data: null, error: null });
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
