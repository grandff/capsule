import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";

import { data } from "react-router";

import makeServerClient from "~/core/lib/supa-client.server";
import { getThreadsAccessToken } from "~/features/settings/queries";

import { getSnsProfiles, getUserProfile } from "../queries";

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

interface UserInsightsResponse {
  data: InsightData[];
  paging?: {
    previous?: string;
    next?: string;
  };
}

interface ApiResponse {
  success: boolean;
  timeseries?: UserInsightsResponse;
  total?: UserInsightsResponse;
  error?: string;
}

export async function action({ request }: ActionFunctionArgs) {
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

  const snsProfile = await getSnsProfiles(client, { userId });
  if (!snsProfile) {
    throw new Response("Unauthorized", { status: 401 });
  }
  const threadUserId = snsProfile.user_id;

  try {
    // 시계열 지표 (views)
    const timeseriesParams = new URLSearchParams({
      metric: "views",
      period: "day",
      access_token: accessToken,
    });

    const timeseriesResponse = await fetch(
      `${THREAD_END_POINT_URL}/${threadUserId}/threads_insights?${timeseriesParams.toString()}`,
      {
        method: "GET",
      },
    );

    if (!timeseriesResponse.ok) {
      throw new Error(`Timeseries API failed: ${timeseriesResponse.status}`);
    }

    const timeseriesData =
      (await timeseriesResponse.json()) as UserInsightsResponse;

    // 총계 지표 (views, reposts, quotes, followers_count)
    const totalParams = new URLSearchParams({
      metric: "views,reposts,quotes,followers_count",
      access_token: accessToken,
    });

    const totalResponse = await fetch(
      `${THREAD_END_POINT_URL}/${threadUserId}/threads_insights?${totalParams.toString()}`,
      {
        method: "GET",
      },
    );

    if (!totalResponse.ok) {
      throw new Error(`Total API failed: ${totalResponse.status}`);
    }

    const totalData = (await totalResponse.json()) as UserInsightsResponse;

    console.log("Timeseries Insights:", timeseriesData);
    console.log("Total Insights:", totalData);

    return data({
      success: true,
      timeseries: timeseriesData,
      total: totalData,
    });
  } catch (error) {
    console.error("Error fetching user insights:", error);
    return data(
      {
        success: false,
        error: "사용자 인사이트를 가져오는데 실패했습니다.",
      },
      { status: 500 },
    );
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  // action과 동일한 로직을 loader에서도 실행
  return action({ request } as ActionFunctionArgs);
}
