import type { SupabaseClient } from "@supabase/supabase-js";

import { getUnixTimestampByDayDiff } from "~/features/history/utils/date-utils";
import { getThreadsAccessToken } from "~/features/settings/queries";

import { getSnsProfiles } from "../queries";

const THREAD_END_POINT_URL = "https://graph.threads.net/v1.0";

interface InsightValue {
  value: number;
  end_time: string;
}

interface InsightData {
  name: string;
  period: string;
  values?: InsightValue[];
  total_value?: {
    value: number;
  };
  title: string;
  description: string;
  id: string;
}

export interface UserInsightsResponse {
  data: InsightData[];
  paging?: {
    previous?: string;
    next?: string;
  };
}

interface ApiResponse {
  success: boolean;
  data?: UserInsightsResponse;
  error?: string;
}

export async function fetchUserInsights(
  client: SupabaseClient,
  userId: string,
): Promise<ApiResponse> {
  const { accessToken, expiresAt } = await getThreadsAccessToken(
    client,
    userId,
  );
  if (!accessToken || !expiresAt) {
    return {
      success: false,
      error: "Access token not found",
    };
  }

  const snsProfile = await getSnsProfiles(client, { userId });
  if (!snsProfile) {
    return {
      success: false,
      error: "SNS profile not found",
    };
  }
  const threadUserId = snsProfile.user_id;

  try {
    // 모든 지표를 한 번에 가져오기
    const params = new URLSearchParams({
      metric: "views,likes,replies,reposts,quotes,followers_count",
      access_token: accessToken,
    });

    const response = await fetch(
      `${THREAD_END_POINT_URL}/${threadUserId}/threads_insights?${params.toString()}`,
      {
        method: "GET",
      },
    );

    if (!response.ok) {
      throw new Error(`Insights API failed: ${response.status}`);
    }

    const insightsData = (await response.json()) as UserInsightsResponse;

    console.log("User Insights:", insightsData);

    return {
      success: true,
      data: insightsData,
    };
  } catch (error) {
    console.error("Error fetching user insights:", error);
    return {
      success: false,
      error: "사용자 인사이트를 가져오는데 실패했습니다.",
    };
  }
}
