import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";

  const isConfigured = !!(
    url && 
    key && 
    !url.includes("your-supabase-project-id") &&
    !url.includes("placeholder-project-id") &&
    url !== "your_supabase_project_url"
  );

  return createServerClient(
    isConfigured ? url : "https://placeholder-project-id.supabase.co",
    isConfigured ? key : "placeholder-anon-key",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Component cookie write fallback
          }
        },
      },
    }
  );
}
