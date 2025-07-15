import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

export async function getRecentThreads(
  client: SupabaseClient<Database>,
  userId: string,
) {
  const { data, error } = await client
    .from("threads")
    .select("*")
    .eq("profile_id", userId)
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    throw error;
  }

  return data;
}
