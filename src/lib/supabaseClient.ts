import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";

export const isSupabaseConfigured = !!(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes("your-supabase-project-id") &&
  !supabaseUrl.includes("placeholder-project-id") &&
  supabaseUrl !== "your_supabase_project_url"
);

export function createClient() {
  return createBrowserClient(
    isSupabaseConfigured ? supabaseUrl : "https://placeholder-project-id.supabase.co",
    isSupabaseConfigured ? supabaseAnonKey : "placeholder-anon-key"
  );
}

export const supabase = isSupabaseConfigured ? createClient() : null;
