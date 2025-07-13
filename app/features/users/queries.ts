import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

export async function getUserProfile(
  client: SupabaseClient<Database>,
  { userId }: { userId: string | null },
) {
  if (!userId) {
    return null;
  }
  const { data, error } = await client
    .from("profiles")
    .select("*")
    .eq("profile_id", userId)
    .single();
  if (error) {
    throw error;
  }
  return data;
}

export async function getSnsProfiles(
  client: SupabaseClient<Database>,
  { userId }: { userId: string | null },
) {
  if (!userId) {
    return null;
  }
  const { data, error } = await client
    .from("sns_profiles")
    .select("*")
    .eq("profile_id", userId)
    .single();
  if (error) {
    throw error;
  }

  return data;
}

// 대시보드 통계를 위한 쿼리들
export async function getDashboardStats(
  client: SupabaseClient<Database>,
  { userId }: { userId: string | null },
) {
  if (!userId) {
    return null;
  }

  // 전체 게시글 수 조회
  const { count: totalPosts, error: countError } = await client
    .from("threads")
    .select("*", { count: "exact", head: true })
    .eq("profile_id", userId)
    .not("result_id", "is", null)
    .not("result_id", "eq", "DELETED");

  if (countError) {
    console.error("Error fetching total posts:", countError);
    throw countError;
  }

  // 평균 통계 계산을 위한 모든 게시글 조회
  const { data: allThreads, error: threadsError } = await client
    .from("threads")
    .select("like_cnt, share_cnt, comment_cnt, view_cnt, now_follow_cnt")
    .eq("profile_id", userId)
    .not("result_id", "is", null)
    .not("result_id", "eq", "DELETED");

  if (threadsError) {
    console.error("Error fetching threads:", threadsError);
    throw threadsError;
  }

  // 평균값 계산
  const averages = {
    posts: Math.round((totalPosts || 0) / 7), // 7일 평균으로 계산
    likes:
      allThreads && allThreads.length > 0
        ? Math.round(
            allThreads.reduce((sum, t) => sum + (t.like_cnt || 0), 0) /
              allThreads.length,
          )
        : 0,
    shares:
      allThreads && allThreads.length > 0
        ? Math.round(
            allThreads.reduce((sum, t) => sum + (t.share_cnt || 0), 0) /
              allThreads.length,
          )
        : 0,
    comments:
      allThreads && allThreads.length > 0
        ? Math.round(
            allThreads.reduce((sum, t) => sum + (t.comment_cnt || 0), 0) /
              allThreads.length,
          )
        : 0,
    views:
      allThreads && allThreads.length > 0
        ? Math.round(
            allThreads.reduce((sum, t) => sum + (t.view_cnt || 0), 0) /
              allThreads.length,
          )
        : 0,
    followers:
      allThreads && allThreads.length > 0
        ? Math.round(
            allThreads.reduce((sum, t) => sum + (t.now_follow_cnt || 0), 0) /
              allThreads.length,
          )
        : 0,
  };

  // 일별 통계 (최근 7일)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: dailyThreads, error: dailyError } = await client
    .from("threads")
    .select(
      "created_at, like_cnt, share_cnt, comment_cnt, view_cnt, now_follow_cnt",
    )
    .eq("profile_id", userId)
    .not("result_id", "is", null)
    .not("result_id", "eq", "DELETED")
    .gte("created_at", sevenDaysAgo.toISOString())
    .order("created_at", { ascending: true });

  if (dailyError) {
    console.error("Error fetching daily threads:", dailyError);
    throw dailyError;
  }

  // 일별 데이터 그룹화
  const dailyStatsMap = new Map<
    string,
    {
      posts: number;
      total_likes: number;
      total_shares: number;
      total_comments: number;
      total_views: number;
      total_followers: number;
    }
  >();

  // 최근 7일간의 모든 날짜 초기화
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    dailyStatsMap.set(dateStr, {
      posts: 0,
      total_likes: 0,
      total_shares: 0,
      total_comments: 0,
      total_views: 0,
      total_followers: 0,
    });
  }

  // 실제 데이터로 채우기
  dailyThreads?.forEach((thread) => {
    const dateStr = new Date(thread.created_at).toISOString().split("T")[0];
    const existing = dailyStatsMap.get(dateStr);
    if (existing) {
      existing.posts += 1;
      existing.total_likes += thread.like_cnt || 0;
      existing.total_shares += thread.share_cnt || 0;
      existing.total_comments += thread.comment_cnt || 0;
      existing.total_views += thread.view_cnt || 0;
      existing.total_followers += thread.now_follow_cnt || 0;
    }
  });

  const dailyStats = Array.from(dailyStatsMap.entries())
    .map(([date, stats]) => ({ date, ...stats }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // FIXME: 팔로워 증가율 계산을 위해서는 이전 날짜의 팔로워 수가 필요합니다.
  // 현재 스키마에서는 이 정보를 제공하기 어려우므로 나중에 user_metrics 테이블을 활용하거나
  // 별도의 팔로워 히스토리 테이블을 만들어야 합니다.

  return {
    averages,
    dailyStats,
  };
}
