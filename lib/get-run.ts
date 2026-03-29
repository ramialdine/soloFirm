import { createClient } from "@supabase/supabase-js";
import type { Run } from "@/types/agents";

export async function getRun(id: string): Promise<Run | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  const sb = createClient(url, key);
  const { data } = await sb.from("runs").select("*").eq("id", id).single();
  return data as Run | null;
}
