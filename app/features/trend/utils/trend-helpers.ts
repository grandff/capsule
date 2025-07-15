import type { Trend } from "../queries";

/**
 * 트렌드 키워드를 순위별로 정렬합니다.
 */
export function sortTrendKeywordsByRank(trend: Trend) {
  return [...trend.trend_keywords].sort((a, b) => a.rank - b.rank);
}

/**
 * 트렌드 데이터가 유효한지 확인합니다.
 */
export function isValidTrendData(trend: Trend | null): trend is Trend {
  return (
    trend !== null &&
    Array.isArray(trend.trend_keywords) &&
    trend.trend_keywords.length > 0
  );
}

/**
 * 다음 분석 예정 시간을 계산합니다.
 */
export function getNextAnalysisTime(): string {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(6, 0, 0, 0);

  return tomorrow.toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
