import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration. Check your .env.local file.');
}

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
