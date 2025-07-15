import type { LoaderFunctionArgs } from "react-router";

import { useEffect } from "react";
import { useFetcher } from "react-router";
import { ToastContainer, toast } from "react-toastify";

import makeServerClient from "~/core/lib/supa-client.server";

import { InterestKeywordsSection } from "../components/interest-keywords-section";
import { NoTrendData } from "../components/no-trend-data";
import { TrendData } from "../components/trend-data";
import { saveInterestKeywords } from "../mutations";
import { getUserInterestKeywords, getUserLatestTrends } from "../queries";
import { isValidTrendData } from "../utils/trend-helpers";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const [client, headers] = makeServerClient(request);

    // 현재 사용자 확인
    const {
      data: { user },
      error: authError,
    } = await client.auth.getUser();

    if (authError || !user) {
      return { interestKeywords: [], latestTrend: null };
    }

    // 사용자 프로필 ID 가져오기
    const { data: profile } = await client
      .from("profiles")
      .select("profile_id")
      .eq("profile_id", user.id)
      .single();

    if (!profile) {
      return { interestKeywords: [], latestTrend: null };
    }

    // 사용자 관심 키워드 조회
    const keywords = await getUserInterestKeywords(client, profile.profile_id);

    // 사용자 최신 트렌드 데이터 조회
    const latestTrend = await getUserLatestTrends(client, profile.profile_id);

    return {
      interestKeywords: keywords.map((k) => k.keyword),
      latestTrend,
      headers,
    };
  } catch (error) {
    console.error("Error in trend-list loader:", error);
    return { interestKeywords: [], latestTrend: null };
  }
}

export async function action({ request }: LoaderFunctionArgs) {
  if (request.method !== "POST") {
    return { success: false, message: "Method not allowed" };
  }

  try {
    const [client, headers] = makeServerClient(request);

    // 현재 사용자 확인
    const {
      data: { user },
      error: authError,
    } = await client.auth.getUser();

    if (authError || !user) {
      return { success: false, message: "인증이 필요합니다." };
    }

    // 사용자 프로필 ID 가져오기
    const { data: profile } = await client
      .from("profiles")
      .select("profile_id")
      .eq("profile_id", user.id)
      .single();

    if (!profile) {
      return { success: false, message: "사용자 프로필을 찾을 수 없습니다." };
    }

    // FormData 파싱
    const formData = await request.formData();
    const keywordsString = formData.get("keywords") as string;

    if (!keywordsString) {
      return { success: false, message: "키워드 데이터가 없습니다." };
    }

    let keywords: string[];
    try {
      keywords = JSON.parse(keywordsString);
    } catch (error) {
      return { success: false, message: "유효하지 않은 키워드 데이터입니다." };
    }

    if (!Array.isArray(keywords)) {
      return { success: false, message: "유효하지 않은 키워드 데이터입니다." };
    }

    // 키워드 저장
    const result = await saveInterestKeywords(
      client,
      profile.profile_id,
      keywords,
    );

    return result;
  } catch (error) {
    console.error("Error in trend-list action:", error);
    return {
      success: false,
      message: "키워드 저장 중 오류가 발생했습니다.",
      errors: [error instanceof Error ? error.message : "Unknown error"],
    };
  }
}

export default function TrendList({
  loaderData,
}: {
  loaderData: Awaited<ReturnType<typeof loader>>;
}) {
  const fetcher = useFetcher();

  // fetcher 상태에 따른 toast 표시
  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.success) {
        toast.success(fetcher.data.message);
      } else {
        toast.error(fetcher.data.message || "키워드 저장에 실패했습니다.");
      }
    }
  }, [fetcher.data]);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Toast Container */}
      <ToastContainer />

      {/* 상단 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">트렌드 분석</h1>
          <p className="text-muted-foreground">트렌드와 키워드 분석</p>
        </div>
      </div>

      {/* 관심 키워드 설정 섹션 */}
      <InterestKeywordsSection
        initialKeywords={loaderData.interestKeywords || []}
      />

      {/* 트렌드 데이터 표시 */}
      {isValidTrendData(loaderData.latestTrend) ? (
        <TrendData trend={loaderData.latestTrend} />
      ) : (
        <NoTrendData />
      )}
    </div>
  );
}
