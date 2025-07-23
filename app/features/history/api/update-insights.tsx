import type { ActionFunctionArgs } from "react-router";

import type {
  ParsedInsights,
  ThreadsInsightsResponse,
} from "../types/insights";

import { DateTime } from "luxon";
import { data } from "react-router";

import { CACHE_TTL, cacheKeys, memoryCache } from "~/core/lib/cache";
import makeServerClient from "~/core/lib/supa-client.server";
import { getThreadsAccessToken } from "~/features/settings/queries";
import {
  getFollowersCount,
  saveUserInsights,
} from "~/features/users/mutations";
import { getSnsProfiles } from "~/features/users/queries";
import type { UserInsightsResponse } from "~/features/users/utils/insights-utils";
import { updateThreadFollowersCount } from "~/features/write/mutations";

import { getUnixTimestampByDayDiff } from "../utils/date-utils";

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
  const resultId = formData.get("resultId") as string;

  if (!threadId) {
    return data({ error: "threadId is required" }, { status: 400 });
  }
  if (!resultId) {
    return data({ error: "resultId is required" }, { status: 400 });
  }

  const threadIdNum = Number(threadId);
  if (isNaN(threadIdNum)) {
    return data({ error: "threadId must be a number" }, { status: 400 });
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
  const snsProfile = await getSnsProfiles(client, { userId });
  if (!accessToken || !expiresAt) {
    throw new Response("Unauthorized", { status: 401 });
  }

  try {
    if (resultId === "UPLOADING") {
      return data(
        {
          success: false,
          message: "쓰레드가 업로드 중입니다.",
          threadStatus: "not_uploaded",
        },
        { status: 200 },
      );
    }

    // 1. 쓰레드에 현재 글 조회해보기
    const retrieveUrl =
      `${THREAD_END_POINT_URL}/${resultId}?` +
      `fields=id&` +
      `access_token=${accessToken}`;

    const retrieveResponse = await fetch(retrieveUrl);
    const retrieveData = await retrieveResponse.json();

    // 게시글을 찾을 수 없는 경우
    if (
      retrieveData.error &&
      retrieveData.error.code === 100 &&
      retrieveData.error.error_subcode === 33
    ) {
      await client
        .from("threads")
        .update({ result_id: "DELETED" })
        .eq("thread_id", threadIdNum);
      console.log("게시글을 찾을 수 없음", retrieveData);
      return data(
        {
          success: false,
          message: "이미 삭제된 쓰레드입니다.",
          threadStatus: "deleted",
        },
        { status: 200 },
      );
    } else {
      // 디버깅용.. 나중에 삭제하기
      console.log("게시글을 찾음", retrieveData);
    }

    // 3. Threads API에서 insight 가져오기
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

    console.log("Threads Insights API response:", response);

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
          .eq("thread_id", threadIdNum);

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
      updated_at: DateTime.now().toISO(),
    };

    // 5베이스 업데이트
    const { error: updateError } = await client
      .from("threads")
      .update(updateData)
      .eq("thread_id", threadIdNum);

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

    // 사용자 인사이트 조회
    try {
      // 모든 지표를 한 번에 가져오기
      const params = new URLSearchParams({
        metric: "views,likes,replies,reposts,quotes,followers_count",
        access_token: accessToken,
      });

      const response = await fetch(
        `${THREAD_END_POINT_URL}/${snsProfile?.user_id}/threads_insights?${params.toString()}`,
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        throw new Error(`Insights API failed: ${response.status}`);
      }

      const insightsData = (await response.json()) as UserInsightsResponse;
      if (insightsData) {
        // 모든 인사이트 데이터 저장 (시계열 + 총계)
        await saveUserInsights(client, user.id, threadIdNum, insightsData.data);

        console.log("백그라운드 사용자 인사이트 저장 완료");
      }

      console.log("User Insights:", insightsData);
    } catch (error) {
      console.error("Error fetching user insights:", error);
    }

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
