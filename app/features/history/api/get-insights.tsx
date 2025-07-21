import type { ActionFunctionArgs } from "react-router";

import type {
  ParsedInsights,
  ThreadsInsightsResponse,
} from "../types/insights";

import { data } from "react-router";

import { CACHE_TTL, cacheKeys, cachedApiCall } from "~/core/lib/cache";
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
  const resultId = formData.get("resultId") as string;

  if (!resultId) {
    return data({ error: "resultId is required" }, { status: 400 });
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
  console.log(`get-insights: getThreadsAccessToken 호출`);
  const { accessToken, expiresAt } = await getThreadsAccessToken(
    client,
    userId,
  );
  if (!accessToken || !expiresAt) {
    throw new Response("Unauthorized", { status: 401 });
  }

  try {
    const cacheKey = cacheKeys.insights(parseInt(resultId, 10));

    const insightsData = await cachedApiCall(
      cacheKey,
      CACHE_TTL.INSIGHTS,
      async () => {
        // Threads Insights API 호출
        const params = new URLSearchParams({
          metric: "likes,replies,views,reposts,quotes,shares",
          access_token: accessToken,
        });

        const response = await fetch(
          `${THREAD_END_POINT_URL}/${resultId}/insights?${params.toString()}`,
          {
            method: "GET",
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Threads Insights API error:", errorData);
          throw new Error(
            `API Error: ${response.status} - ${JSON.stringify(errorData)}`,
          );
        }

        const data: ThreadsInsightsResponse = await response.json();
        console.log("Threads Insights API response:", data);

        // 파싱된 데이터 반환
        const parsedData = parseInsightsData(data);
        return parsedData;
      },
    );

    return data(
      {
        success: true,
        insights: insightsData,
        rawData: insightsData, // 원본 데이터도 포함
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching insights:", error);
    return data(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
