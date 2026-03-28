import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _publicClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_publicClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error("Supabase URL and anon key are required");
    _publicClient = createClient(url, key);
  }
  return _publicClient;
}

let _serviceClient: SupabaseClient | null = null;

export function getServiceSupabase(): SupabaseClient {
  if (!_serviceClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error("Supabase URL and service role key are required");
    _serviceClient = createClient(url, key);
  }
  return _serviceClient;
}
