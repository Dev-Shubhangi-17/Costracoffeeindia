import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project-id.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

export function getSupabaseServerClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return null;
  }
  return createClient(supabaseUrl, supabaseServiceKey);
}
