import type { SupabaseClient } from "@supabase/supabase-js";

export interface SaveInterestKeywordsRequest {
  keywords: string[];
}

export interface SaveInterestKeywordsResponse {
  success: boolean;
  message: string;
  savedKeywords?: string[];
  errors?: string[];
}

/**
 * 사용자의 관심 키워드를 저장합니다.
 * 기존 키워드는 유지하고 새로운 키워드만 추가합니다.
 */
export async function saveInterestKeywords(
  client: SupabaseClient,
  profileId: string,
  keywords: string[],
): Promise<SaveInterestKeywordsResponse> {
  try {
    if (!keywords || keywords.length === 0) {
      return {
        success: false,
        message: "저장할 키워드가 없습니다.",
      };
    }

    // 중복 제거 및 공백 제거
    const cleanKeywords = [
      ...new Set(keywords.map((k) => k.trim()).filter((k) => k.length > 0)),
    ];

    if (cleanKeywords.length === 0) {
      return {
        success: false,
        message: "유효한 키워드가 없습니다.",
      };
    }

    // 기존 키워드 확인
    const { data: existingKeywords } = await client
      .from("user_interest_keywords")
      .select("keyword")
      .eq("profile_id", profileId)
      .eq("is_active", true)
      .in("keyword", cleanKeywords);

    const existingKeywordSet = new Set(
      existingKeywords?.map((k) => k.keyword) || [],
    );
    const newKeywords = cleanKeywords.filter(
      (keyword) => !existingKeywordSet.has(keyword),
    );

    if (newKeywords.length === 0) {
      return {
        success: true,
        message: "모든 키워드가 이미 저장되어 있습니다.",
        savedKeywords: cleanKeywords,
      };
    }

    // 새로운 키워드들 저장
    const keywordsToInsert = newKeywords.map((keyword, index) => ({
      profile_id: profileId,
      keyword: keyword,
      sort_order: index,
      is_active: true,
    }));

    const { error: insertError } = await client
      .from("user_interest_keywords")
      .insert(keywordsToInsert);

    if (insertError) {
      console.error("Error inserting interest keywords:", insertError);
      return {
        success: false,
        message: "키워드 저장 중 오류가 발생했습니다.",
        errors: [insertError.message],
      };
    }

    return {
      success: true,
      message: `${newKeywords.length}개의 키워드가 성공적으로 저장되었습니다.`,
      savedKeywords: cleanKeywords,
    };
  } catch (error) {
    console.error("Error in saveInterestKeywords:", error);
    return {
      success: false,
      message: "키워드 저장 중 예상치 못한 오류가 발생했습니다.",
      errors: [error instanceof Error ? error.message : "Unknown error"],
    };
  }
}

/**
 * 사용자의 특정 관심 키워드를 삭제합니다 (비활성화).
 */
export async function deleteInterestKeyword(
  client: SupabaseClient,
  profileId: string,
  keyword: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const { error } = await client
      .from("user_interest_keywords")
      .update({ is_active: false })
      .eq("profile_id", profileId)
      .eq("keyword", keyword);

    if (error) {
      console.error("Error deleting interest keyword:", error);
      return {
        success: false,
        message: "키워드 삭제 중 오류가 발생했습니다.",
      };
    }

    return {
      success: true,
      message: "키워드가 성공적으로 삭제되었습니다.",
    };
  } catch (error) {
    console.error("Error in deleteInterestKeyword:", error);
    return {
      success: false,
      message: "키워드 삭제 중 예상치 못한 오류가 발생했습니다.",
    };
  }
}

/**
 * 사용자의 모든 관심 키워드를 삭제합니다 (비활성화).
 */
export async function deleteAllInterestKeywords(
  client: SupabaseClient,
  profileId: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const { error } = await client
      .from("user_interest_keywords")
      .update({ is_active: false })
      .eq("profile_id", profileId);

    if (error) {
      console.error("Error deleting all interest keywords:", error);
      return {
        success: false,
        message: "키워드 삭제 중 오류가 발생했습니다.",
      };
    }

    return {
      success: true,
      message: "모든 키워드가 성공적으로 삭제되었습니다.",
    };
  } catch (error) {
    console.error("Error in deleteAllInterestKeywords:", error);
    return {
      success: false,
      message: "키워드 삭제 중 예상치 못한 오류가 발생했습니다.",
    };
  }
}
