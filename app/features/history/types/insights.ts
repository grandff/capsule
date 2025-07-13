// Threads API 인사이트 응답 타입
export interface ThreadsInsightValue {
  value: number;
  end_time?: string;
}

export interface ThreadsInsightMetric {
  name: string;
  period: string;
  values: ThreadsInsightValue[];
  title: string;
  description: string;
  id: string;
}

export interface ThreadsInsightsResponse {
  data: ThreadsInsightMetric[];
}

// 파싱된 인사이트 데이터 타입
export interface ParsedInsights {
  likes: number;
  replies: number;
  views: number;
  reposts: number;
  quotes: number;
  shares: number;
  total_shares: number; // reposts + quotes + shares
}
