import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

import { redirect } from "react-router";

// 사용자 인사이트 데이터 저장 (통합)
export async function saveUserInsights(
  client: SupabaseClient<Database>,
  profileId: string,
  threadId: number,
  insightsData: Array<{
    name: string;
    period: string;
    values?: Array<{ value: number; end_time: string }>;
    total_value?: { value: number };
  }>,
) {
  if (insightsData.length === 0) return;

  const insightsToInsert: Array<{
    profile_id: string;
    thread_id: number;
    metric_name: string;
    metric_type: "timeseries" | "total";
    period: string;
    value: number;
    end_time: string;
  }> = [];

  // 시계열 데이터 (values가 있는 경우)
  insightsData.forEach((insight) => {
    if (insight.values && insight.values.length > 0) {
      insight.values.forEach((value) => {
        insightsToInsert.push({
          profile_id: profileId,
          thread_id: threadId,
          metric_name: insight.name,
          metric_type: "timeseries",
          period: insight.period,
          value: value.value,
          end_time: new Date(value.end_time).toISOString(),
        });
      });
    }
  });

  // 총계 데이터 (total_value가 있는 경우)
  insightsData.forEach((insight) => {
    if (insight.total_value) {
      insightsToInsert.push({
        profile_id: profileId,
        thread_id: threadId,
        metric_name: insight.name,
        metric_type: "total",
        period: insight.period,
        value: insight.total_value.value,
        end_time: new Date().toISOString(),
      });
    }
  });

  if (insightsToInsert.length > 0) {
    try {
      // 1. 기존 데이터 삭제 (같은 profile_id, thread_id, metric_name, metric_type, period 조합)
      console.log("profileId", profileId);
      console.log("threadId", threadId);
      const { error: deleteError } = await client
        .from("user_insights")
        .delete()
        .eq("profile_id", profileId)
        .eq("thread_id", threadId);

      if (deleteError) {
        console.error("Error deleting existing user insights:", deleteError);
        throw deleteError;
      }

      //2데이터 삽입
      const { error: insertError } = await client
        .from("user_insights")
        .insert(insightsToInsert);

      if (insertError) {
        console.error("Error inserting user insights:", insertError);
        throw insertError;
      }

      console.log(`${insightsToInsert.length}개의 인사이트 데이터 저장 완료`);
    } catch (error) {
      console.error("Error in saveUserInsights:", error);
      throw error;
    }
  }
}

// 팔로워 수 가져오기
export async function getFollowersCount(
  insightsData: Array<{
    name: string;
    total_value?: { value: number };
  }>,
): Promise<number> {
  const followersMetric = insightsData.find(
    (metric) => metric.name === "followers_count",
  );
  return followersMetric?.total_value?.value || 0;
}

// 회원탈퇴 처리
export async function deleteUserAccount(
  client: SupabaseClient<Database>,
  userId: string,
) {
  try {
    // 1. 사용자와 관련된 모든 데이터 삭제
    const { error: userInsightsError } = await client
      .from("user_insights")
      .delete()
      .eq("profile_id", userId);

    if (userInsightsError) {
      console.error("Error deleting user insights:", userInsightsError);
      throw userInsightsError;
    }

    const { error: threadMediaError } = await client
      .from("thread_media")
      .delete()
      .eq("profile_id", userId);

    if (threadMediaError) {
      console.error("Error deleting thread media:", threadMediaError);
      throw threadMediaError;
    }

    const { error: threadsError } = await client
      .from("threads")
      .delete()
      .eq("profile_id", userId);

    if (threadsError) {
      console.error("Error deleting threads:", threadsError);
      throw threadsError;
    }

    const { error: profilesError } = await client
      .from("profiles")
      .delete()
      .eq("profile_id", userId);

    if (profilesError) {
      console.error("Error deleting profile:", profilesError);
      throw profilesError;
    }

    console.log("User account deleted successfully");
  } catch (error) {
    console.error("Error in deleteUserAccount:", error);
    throw error;
  }
}
