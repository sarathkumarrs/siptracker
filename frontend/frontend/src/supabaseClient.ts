// frontend/src/supabaseClient.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Session, User } from '@supabase/supabase-js'; // <-- Fix: Use 'import type' for Session and User

const supabaseUrl: string = "https://hpybjnvodvjmpuqmoigg.supabase.co";
const supabaseAnonKey: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhweWJqbnZvZHZqbXB1cW1vaWdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMDI0NDMsImV4cCI6MjA2NDg3ODQ0M30.IVhddREMaSwSRs_LgBS2OEpOX1YbAVWvrd1T6L3lbE8";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or Anon Key is missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your frontend/.env file.");
  throw new Error("Supabase environment variables are not set. Cannot initialize client.");
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// You might also need to use 'import type' in AuthContext.tsx if similar errors appear there:
// import type { Session, User } from '@supabase/supabase-js';
// ... for interfaces and type annotations