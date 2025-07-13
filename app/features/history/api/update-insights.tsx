import type { ActionFunctionArgs } from "react-router";

import type {
  ParsedInsights,
  ThreadsInsightsResponse,
} from "../types/insights";

import { data } from "react-router";

import { CACHE_TTL, cacheKeys, memoryCache } from "~/core/lib/cache";
import makeServerClient from "~/core/lib/supa-client.server";
import { getThreadsAccessToken } from "~/features/settings/queries";

const THREAD_END_POINT_URL = "https://graph.threads.net/v1.0";

// Threads API 인사이트 데이터 파싱 함수
function parseInsightsData(
  insightsData: ThreadsInsightsResponse,
): ParsedInsights {
  const result: ParsedInsights = {
    likes: 0,
    replies: 0,
    views: 0,
    reposts: 0,
    quotes: 0,
    shares: 0,
    total_shares: 0,
  };

  // 각 메트릭별로 데이터 추출
  insightsData.data.forEach((metric) => {
    if (metric.values && metric.values.length > 0) {
      const value = metric.values[0].value;

      switch (metric.name) {
        case "likes":
          result.likes = value;
          break;
        case "replies":
          result.replies = value;
          break;
        case "views":
          result.views = value;
          break;
        case "reposts":
          result.reposts = value;
          break;
        case "quotes":
          result.quotes = value;
          break;
        case "shares":
          result.shares = value;
          break;
      }
    }
  });

  // 총 공유 수 계산
  result.total_shares = result.reposts + result.quotes + result.shares;

  return result;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const threadId = formData.get("threadId") as string;

  if (!threadId) {
    return data({ error: "threadId is required" }, { status: 400 });
  }

  // get access token from user id
  const [client, headers] = makeServerClient(request);
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const userId = user.id;
  const { accessToken, expiresAt } = await getThreadsAccessToken(
    client,
    userId,
  );
  if (!accessToken || !expiresAt) {
    throw new Response("Unauthorized", { status: 401 });
  }

  try {
    // 1. 먼저 쓰레드 정보 조회
    const { data: thread, error: threadError } = await client
      .from("threads")
      .select("thread_id, result_id, profile_id")
      .eq("thread_id", parseInt(threadId, 10))
      .eq("profile_id", userId)
      .single();

    if (threadError || !thread) {
      return data({ error: "Thread not found" }, { status: 404 });
    }

    // 2. result_id가 없으면 쓰레드에 업로드되지 않은 상태
    if (!thread.result_id || thread.result_id === "ERROR") {
      return data(
        {
          success: false,
          message: "Thread not uploaded to Threads yet",
          threadStatus: "not_uploaded",
        },
        { status: 200 },
      );
    }

    // 3. Threads API에서 insight 가져오기
    const params = new URLSearchParams({
      metric: "likes,replies,views,reposts,quotes,shares",
      access_token: accessToken,
    });

    const response = await fetch(
      `${THREAD_END_POINT_URL}/${thread.result_id}/insights?${params.toString()}`,
      {
        method: "GET",
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Threads Insights API error:", errorData);

      // API 에러 시 쓰레드 상태 확인
      if (response.status === 404) {
        // 쓰레드가 삭제되었을 가능성
        await client
          .from("threads")
          .update({
            result_id: "DELETED",
            send_flag: false,
          })
          .eq("thread_id", parseInt(threadId, 10));

        return data(
          {
            success: false,
            message: "Thread may have been deleted from Threads",
            threadStatus: "deleted",
          },
          { status: 200 },
        );
      }

      return data(
        {
          error: "Failed to fetch insights",
          details: errorData,
        },
        { status: response.status },
      );
    }

    const insightsData: ThreadsInsightsResponse = await response.json();
    console.log("Threads Insights API response:", insightsData);

    // 4. insight 데이터 파싱 및 업데이트
    const parsedInsights: ParsedInsights = parseInsightsData(insightsData);

    const updateData = {
      like_cnt: parsedInsights.likes,
      comment_cnt: parsedInsights.replies,
      view_cnt: parsedInsights.views,
      share_cnt: parsedInsights.total_shares,
      updated_at: new Date().toISOString(),
    };

    // 5. 데이터베이스 업데이트
    const { error: updateError } = await client
      .from("threads")
      .update(updateData)
      .eq("thread_id", parseInt(threadId, 10));

    if (updateError) {
      console.error("Error updating thread insights:", updateError);
      return data(
        {
          error: "Failed to update database",
          details: updateError,
        },
        { status: 500 },
      );
    }

    // 성공 시 관련 캐시 무효화
    memoryCache.deletePattern(`thread:${threadId}`);
    memoryCache.delete(cacheKeys.insights(parseInt(threadId, 10)));

    return data(
      {
        success: true,
        insights: updateData,
        threadStatus: "active",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating insights:", error);
    return data(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
