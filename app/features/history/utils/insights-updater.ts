import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

import { saveUserInsights } from "~/features/users/mutations";
import { fetchUserInsights } from "~/features/users/utils/insights-utils";

/**
 * 인사이트 업데이트를 백그라운드에서 실행하는 함수
 * send-to-thread.tsx와 유사한 패턴으로 구현
 */
export async function updateInsightsInBackground(
  client: SupabaseClient<Database>,
  userId: string,
  threadId: number,
  resultId: string,
  requestOrigin: string,
) {
  console.log("=== 백그라운드 인사이트 업데이트 시작 ===");

  try {
    // 1. 먼저 retrieve-user-posts 호출 (result_id 기준)
    if (resultId) {
      try {
        const retrieveRes = await fetch(
          `${requestOrigin}/api/history/retrieve-user-posts/${resultId}`,
        );
        const retrieveData = await retrieveRes.json();
        console.log("[retrieve-user-posts] 응답:", retrieveData);

        // 게시글을 찾을 수 없는 경우 인사이트 업데이트 중단
        if (!retrieveData.success) {
          console.log("게시글을 찾을 수 없습니다:", retrieveData.message);
          return { success: false, error: "게시글을 찾을 수 없습니다" };
        }
      } catch (retrieveErr) {
        console.error("[retrieve-user-posts] 호출 오류:", retrieveErr);
        return { success: false, error: "게시글 조회 중 오류가 발생했습니다" };
      }
    }

    // 2인사이트 데이터 가져오기 및 저장
    const insightsData = await fetchUserInsights(client, userId);

    if (insightsData.success && insightsData.data) {
      await saveUserInsights(client, userId, threadId, insightsData.data.data);
      console.log("백그라운드 인사이트 업데이트 완료");
      return { success: true };
    } else {
      console.log("인사이트 데이터를 가져올 수 없습니다.");
      return { success: false, error: "인사이트 데이터를 가져올 수 없습니다" };
    }
  } catch (error) {
    console.error("백그라운드 인사이트 업데이트 실패:", error);
    return {
      success: false,
      error: "인사이트 업데이트 중 오류가 발생했습니다",
    };
  }
}
