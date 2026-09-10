import { createClient } from "@supabase/supabase-js";

// Use placeholder fallbacks during static export builds to prevent compilation crashes
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project-id.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn("Supabase credentials missing from active environment. Using static build placeholders.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
