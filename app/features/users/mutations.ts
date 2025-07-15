import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

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
    const { error } = await client
      .from("user_insights")
      .insert(insightsToInsert);

    if (error) {
      console.error("Error saving user insights:", error);
      throw error;
    }

    console.log(`${insightsToInsert.length}개의 인사이트 데이터 저장 완료`);
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
