import { DateTime } from "luxon";

export interface DashboardStats {
  averages: {
    posts: number;
    likes: number;
    shares: number;
    comments: number;
    views: number;
    followers: number;
  };
  dailyStats: DailyStat[];
}

export interface DailyStat {
  date: string;
  posts: number;
  total_likes: number;
  total_shares: number;
  total_comments: number;
  total_views: number;
}

export const DEFAULT_DASHBOARD_STATS: DashboardStats = {
  averages: {
    posts: 0,
    likes: 0,
    shares: 0,
    comments: 0,
    views: 0,
    followers: 0,
  },
  dailyStats: [],
};

export function formatDate(dateString: string): string {
  const date = DateTime.fromISO(dateString, { zone: "Asia/Seoul" });
  return date.toFormat("M월 d일");
}

export function getStatIconColor(statType: string): string {
  const colors = {
    posts: "text-indigo-600 dark:text-indigo-400",
    likes: "text-red-600 dark:text-red-400",
    followers: "text-green-600 dark:text-green-400",
    shares: "text-purple-600 dark:text-purple-400",
    comments: "text-green-600 dark:text-green-400",
    views: "text-blue-600 dark:text-blue-400",
  };

  return (
    colors[statType as keyof typeof colors] ||
    "text-gray-600 dark:text-gray-400"
  );
}

export function getStatLabel(statType: string): string {
  const labels = {
    posts: "평균 글 수",
    likes: "평균 좋아요",
    followers: "평균 팔로워 증가",
    shares: "평균 공유",
    comments: "평균 답글",
    views: "평균 조회수",
  };

  return labels[statType as keyof typeof labels] || statType;
}

export function getStatSuffix(statType: string): string {
  const suffixes = {
    posts: "개",
    followers: "+",
    likes: "",
    shares: "",
    comments: "",
    views: "",
  };

  return suffixes[statType as keyof typeof suffixes] || "";
}
