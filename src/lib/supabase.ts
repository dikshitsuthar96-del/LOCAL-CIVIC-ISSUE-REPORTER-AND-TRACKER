import { createClient, SupabaseClient } from '@supabase/supabase-js';

const env = (import.meta as any).env || {};
const supabaseUrl =
  env.VITE_SUPABASE_URL || 'https://pftkladzsrwgbxyyuowm.supabase.co';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseAnonKey && supabaseAnonKey.trim() !== '');

// Guard against createClient throwing when anon key is not yet set in environment variables
let client: SupabaseClient | null = null;
if (isSupabaseConfigured) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } catch (err) {
    console.warn('[Supabase] Failed to initialize Supabase client:', err);
  }
}

export const supabase = client;
export { supabaseUrl, supabaseAnonKey };
