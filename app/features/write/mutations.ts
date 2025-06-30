import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

// TODO property, keyword 등록
export async function saveThread(
  client: SupabaseClient<Database>,
  {
    shortText,
    thread,
    targetType,
    sendFlag,
    resultId,
    profileId,
  }: {
    shortText: string;
    thread: string;
    targetType: "thread" | "X";
    sendFlag: boolean;
    resultId: string;
    profileId: string;
  },
) {
  const { error } = await client.from("threads").insert({
    short_text: shortText,
    thread: thread,
    target_type: targetType,
    send_flag: sendFlag,
    result_id: resultId,
    profile_id: profileId,
  });

  if (error) {
    console.error("Error saving thread:", error);
    throw error;
  }
}
