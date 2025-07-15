import type { LoaderFunctionArgs } from "react-router";

import adminClient from "~/core/lib/supa-admin-client.server";
import makeServerClient from "~/core/lib/supa-client.server";
import { getUserList } from "~/features/users/queries";
import { getPerplexityPrompt } from "~/features/write/api/prompts";
import { validatePerplexityCronSecret } from "~/utils/cron-validation";

import { saveTrendData } from "../mutations";
import { callPerplexityAPI } from "../utils/perplexity-client";

interface TrendAnalysisData {
  keywordList: string[];
  dateRange: string;
  prompt: string;
}

// 특정 사용자의 관심 키워드 조회 함수
async function getUserKeywords(
  client: any,
  profileId: string,
): Promise<string[]> {
  const { data: userKeywords, error: keywordsError } = await client
    .from("user_interest_keywords")
    .select("keyword")
    .eq("profile_id", profileId)
    .eq("is_active", true);

  if (keywordsError) {
    console.error(
      `Error fetching keywords for user ${profileId}:`,
      keywordsError,
    );
    return [];
  }

  return (
    (userKeywords as Array<{ keyword: string }>)?.map((k) => k.keyword) || []
  );
}

// 날짜 범위 계산 함수
function calculateDateRange(): string {
  const today = new Date();
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 7);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}년 ${month}월 ${day}일`;
  };

  return `${formatDate(oneWeekAgo)}부터 ${formatDate(today)}`;
}

// 프롬프트 생성 및 변수 치환 함수
function generatePrompt(keywordList: string[], dateRange: string): string {
  let prompt = getPerplexityPrompt();
  prompt = prompt.replace("{{keyword-list}}", JSON.stringify(keywordList));
  prompt = prompt.replace("{{date-range}}", dateRange);
  return prompt;
}

// 메인 트렌드 분석 데이터 준비 함수
async function prepareTrendAnalysisData(
  client: any,
  profileId: string,
): Promise<TrendAnalysisData | null> {
  // 1. 사용자 관심 키워드 조회
  const keywordList = await getUserKeywords(client, profileId);

  if (keywordList.length === 0) {
    console.log(`사용자 ${profileId}: 관심 키워드가 없어서 분석 건너뜀`);
    return null;
  }

  // 2. 날짜 범위 계산
  const dateRange = calculateDateRange();

  // 3. 프롬프트 생성 및 변수 치환
  const prompt = generatePrompt(keywordList, dateRange);

  return {
    keywordList,
    dateRange,
    prompt,
  };
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  // 1. 헤더 검증 (cronjob에서만 호출 가능) - 로컬 개발 환경에서는 건너뛰기
  const isLocalDev =
    process.env.NODE_ENV === "development" && !process.env.VERCEL;
  if (!isLocalDev && !validatePerplexityCronSecret(request)) {
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const [client, headers] = makeServerClient(request);

    // 2. 현재 사용자 목록 조회
    const userList = await getUserList(client);

    // 3. 사용자 별로 트렌드 분석 시작
    for (const user of userList) {
      try {
        // 3-1. 사용자별 트렌드 분석 데이터 준비
        const analysisData = await prepareTrendAnalysisData(
          client,
          user.profile_id,
        );

        if (!analysisData) {
          continue; // 키워드가 없는 사용자는 건너뛰기
        }

        // 3-2. Perplexity API 호출
        console.log(`사용자 ${user.profile_id} Perplexity API 호출 시작...`);
        const perplexityResponse = await callPerplexityAPI(analysisData.prompt);

        // 3-3. 응답에서 content 추출
        const content = perplexityResponse.choices[0]?.message?.content;
        if (!content) {
          console.log(
            `사용자 ${user.profile_id}: Perplexity API에서 content를 받지 못함`,
          );
          continue;
        }

        console.log(
          `사용자 ${user.profile_id} Perplexity API 응답 content:`,
          content,
        );

        // 3-4. 트렌드 데이터 저장 (admin 권한 필요)
        const saveResult = await saveTrendData(
          adminClient,
          user.profile_id,
          content,
        );

        if (saveResult.success) {
          console.log(`사용자 ${user.profile_id} 트렌드 데이터 저장 성공`);
        } else {
          console.error(
            `사용자 ${user.profile_id} 트렌드 데이터 저장 실패:`,
            saveResult.error,
          );
        }
      } catch (error) {
        console.error(`사용자 ${user.profile_id} 트렌드 분석 중 오류:`, error);
      }
    }

    return new Response("Trend analysis completed", { status: 200 });
  } catch (error) {
    console.error("Error in get-trend-by-perplexity loader:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
