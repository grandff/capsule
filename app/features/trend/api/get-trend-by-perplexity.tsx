import type { LoaderFunctionArgs } from "react-router";

import makeServerClient from "~/core/lib/supa-client.server";
import { getPerplexityPrompt } from "~/features/write/api/prompts";
import { validatePerplexityCronSecret } from "~/utils/cron-validation";

import { callPerplexityAPI } from "../utils/perplexity-client";

interface TrendAnalysisData {
  keywordList: string[];
  dateRange: string;
  prompt: string;
}

// 모든 사용자 관심 키워드 조회 함수
async function getAllUserKeywords(client: any): Promise<string[]> {
  const { data: allKeywords, error: keywordsError } = await client
    .from("user_interest_keywords")
    .select("keyword")
    .eq("is_active", true);

  if (keywordsError) {
    console.error("Error fetching keywords:", keywordsError);
    throw new Error("Failed to fetch keywords");
  }

  // 중복 제거하여 고유한 키워드 목록 생성
  const keywords =
    (allKeywords as Array<{ keyword: string }>)?.map((k) => k.keyword) || [];
  const uniqueKeywords = [...new Set(keywords)];
  return uniqueKeywords;
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
): Promise<TrendAnalysisData> {
  // 1. 모든 사용자 관심 키워드 조회
  const keywordList = await getAllUserKeywords(client);

  if (keywordList.length === 0) {
    throw new Error("관심 키워드가 없습니다.");
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
  // 1. 헤더 검증 (cronjob에서만 호출 가능)
  if (!validatePerplexityCronSecret(request)) {
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const [client, headers] = makeServerClient(request);

    // 2. 트렌드 분석 데이터 준비
    const analysisData = await prepareTrendAnalysisData(client);

    // 3. Perplexity API 호출
    console.log("Calling Perplexity API with prompt:", analysisData.prompt);
    const perplexityResponse = await callPerplexityAPI(analysisData.prompt);

    console.log("Perplexity API call completed successfully");
    console.log("Full response:", perplexityResponse);

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Error in get-trend-by-perplexity loader:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
