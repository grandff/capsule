import type { SupabaseClient } from "@supabase/supabase-js";

export interface UserInterestKeyword {
  keyword_id: number;
  profile_id: string;
  keyword: string;
  sort_order: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

/**
 * 사용자의 관심 키워드 목록을 조회합니다.
 */
export async function getUserInterestKeywords(
  client: SupabaseClient,
  profileId: string,
): Promise<UserInterestKeyword[]> {
  try {
    const { data, error } = await client
      .from("user_interest_keywords")
      .select("*")
      .eq("profile_id", profileId)
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user interest keywords:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error in getUserInterestKeywords:", error);
    throw error;
  }
}

/**
 * 특정 키워드가 사용자의 관심 키워드에 포함되어 있는지 확인합니다.
 */
export async function isKeywordInUserInterests(
  client: SupabaseClient,
  profileId: string,
  keyword: string,
): Promise<boolean> {
  try {
    const { data, error } = await client
      .from("user_interest_keywords")
      .select("keyword_id")
      .eq("profile_id", profileId)
      .eq("keyword", keyword)
      .eq("is_active", true)
      .limit(1);

    if (error) {
      console.error("Error checking keyword in user interests:", error);
      throw error;
    }

    return (data?.length || 0) > 0;
  } catch (error) {
    console.error("Error in isKeywordInUserInterests:", error);
    throw error;
  }
}
