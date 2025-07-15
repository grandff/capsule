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

export interface SaveTrendDataResponse {
  success: boolean;
  message: string;
  trendId?: number;
  keywordIds?: number[];
  error?: string;
}

interface TrendKeywordData {
  keyword: string;
  rank: number;
  description: string;
}

/**
 * Perplexity API 응답을 파싱하여 트렌드 데이터를 저장합니다.
 */
export async function saveTrendData(
  client: SupabaseClient,
  profileId: string,
  content: string,
): Promise<SaveTrendDataResponse> {
  try {
    // 1. JSON 파싱 시도
    let trendData;
    try {
      // content에서 JSON 부분만 추출
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("JSON 형식을 찾을 수 없습니다.");
      }

      trendData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("JSON 파싱 오류:", parseError);
      return {
        success: false,
        message: "Perplexity API 응답을 파싱할 수 없습니다.",
        error: parseError instanceof Error ? parseError.message : "Parse error",
      };
    }

    // 2. 데이터 구조 검증
    if (!trendData.data || !Array.isArray(trendData.data)) {
      return {
        success: false,
        message: "트렌드 데이터 구조가 올바르지 않습니다.",
        error: "Invalid data structure",
      };
    }

    // 3. 키워드 데이터 추출 및 검증
    const keywords: TrendKeywordData[] = [];
    for (const item of trendData.data) {
      if (item.keyword && typeof item.rank === "number" && item.description) {
        keywords.push({
          keyword: item.keyword,
          rank: item.rank,
          description: item.description,
        });
      }
    }

    if (keywords.length === 0) {
      return {
        success: false,
        message: "유효한 키워드 데이터가 없습니다.",
        error: "No valid keywords",
      };
    }

    // 4. 트렌드 데이터 저장 (먼저 마스터 테이블에 저장)
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD 형식

    const { data: trendResult, error: trendError } = await client
      .from("trends")
      .insert({
        trend_date: today,
        profile_id: profileId,
      })
      .select("trend_id")
      .single();

    if (trendError) {
      console.error("트렌드 저장 오류:", trendError);
      return {
        success: false,
        message: "트렌드 저장 중 오류가 발생했습니다.",
        error: trendError.message,
      };
    }

    // 5. 트렌드 키워드들을 해당 트렌드에 연결 (1:N 관계)
    const trendId = trendResult.trend_id;
    const keywordIds: number[] = [];

    for (const keywordData of keywords) {
      const { data: keywordResult, error: keywordError } = await client
        .from("trend_keywords")
        .insert({
          trend_id: trendId,
          keyword: keywordData.keyword,
          rank: keywordData.rank,
          description: keywordData.description,
        })
        .select("trend_keyword_id")
        .single();

      if (keywordError) {
        console.error("키워드 저장 오류:", keywordError);
        return {
          success: false,
          message: "키워드 저장 중 오류가 발생했습니다.",
          error: keywordError.message,
        };
      }

      if (keywordResult) {
        keywordIds.push(keywordResult.trend_keyword_id);
      }
    }

    return {
      success: true,
      message: `${keywords.length}개의 키워드와 트렌드 데이터가 성공적으로 저장되었습니다.`,
      trendId: trendResult?.trend_id,
      keywordIds,
    };
  } catch (error) {
    console.error("Error in saveTrendData:", error);
    return {
      success: false,
      message: "트렌드 데이터 저장 중 예상치 못한 오류가 발생했습니다.",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
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
