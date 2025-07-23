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

// 사용자의 최신 GPT 분석 결과 조회
export async function getLatestGptAnalysisResult(
  client: SupabaseClient<Database>,
  profileId: string,
) {
  const { data, error } = await client
    .from("gpt_analysis_results")
    .select("*")
    .eq("profile_id", profileId)
    .order("analysis_date", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // 데이터가 없는 경우
      return null;
    }
    throw error;
  }

  return data;
}

// 미디어 목록 조회
export async function getMediaList(
  client: SupabaseClient<Database>,
  profileId: string,
  threadId: number,
) {
  const { data, error } = await client
    .from("thread_media")
    .select("public_url, media_type")
    .eq("profile_id", profileId)
    .eq("thread_id", threadId);

  if (error) {
    throw error;
  }

  return data;
}
