import adminClient from "~/core/lib/supa-admin-client.server";
import { prepareTrendAnalysisData } from "~/features/trend/api/get-trend-by-perplexity";
import { saveTrendData } from "~/features/trend/mutations";
import { callPerplexityAPI } from "~/features/trend/utils/perplexity-client";

/**
 * 개별 사용자에 대한 트렌드 분석을 수행합니다.
 * @param client Supabase 클라이언트 (사용자 인증용)
 * @param profileId 사용자 프로필 ID
 * @returns 분석 성공 여부
 */
export async function analyzeUserTrend(
  client: any,
  profileId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. 사용자별 트렌드 분석 데이터 준비
    const analysisData = await prepareTrendAnalysisData(client, profileId);

    if (!analysisData) {
      console.log(`사용자 ${profileId}: 관심 키워드가 없어서 분석 건너뜀`);
      return { success: true }; // 키워드가 없는 것은 오류가 아님
    }

    // 2. Perplexity API 호출
    console.log(`사용자 ${profileId} Perplexity API 호출 시작...`);
    const perplexityResponse = await callPerplexityAPI(analysisData.prompt);

    // 3. 응답에서 content 추출
    const content = perplexityResponse.choices[0]?.message?.content;
    if (!content) {
      console.log(
        `사용자 ${profileId}: Perplexity API에서 content를 받지 못함`,
      );
      return { success: false, error: "Perplexity API에서 응답을 받지 못함" };
    }

    console.log(`사용자 ${profileId} Perplexity API 응답 content:`, content);

    // 4. 트렌드 데이터 저장 (admin 클라이언트 사용하여 권한 문제 방지)
    const saveResult = await saveTrendData(adminClient, profileId, content);

    if (saveResult.success) {
      console.log(`사용자 ${profileId} 트렌드 데이터 저장 성공`);
      return { success: true };
    } else {
      console.error(
        `사용자 ${profileId} 트렌드 데이터 저장 실패:`,
        saveResult.error,
      );
      return { success: false, error: saveResult.error };
    }
  } catch (error) {
    console.error(`사용자 ${profileId} 트렌드 분석 중 오류:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "알 수 없는 오류",
    };
  }
}
