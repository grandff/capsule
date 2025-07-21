import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

import { DateTime } from "luxon";

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

  // 최근 14일간의 게시글 조회 (최신순)
  const fourteenDaysAgo = DateTime.now().minus({ days: 14 }).toISO();

  const { data: threads, error: threadsError } = await client
    .from("threads")
    .select(
      "created_at, like_cnt, share_cnt, comment_cnt, view_cnt, now_follow_cnt",
    )
    .eq("profile_id", userId)
    .not("result_id", "is", null)
    .not("result_id", "eq", "DELETED")
    .gte("created_at", fourteenDaysAgo)
    .order("created_at", { ascending: false });

  if (threadsError) {
    console.error("Error fetching threads:", threadsError);
    throw threadsError;
  }

  // luxon을 사용한 날짜 그룹핑
  const dailyStatsMap = new Map<
    string,
    {
      posts: number;
      total_likes: number;
      total_shares: number;
      total_comments: number;
      total_views: number;
    }
  >();

  // 최근 14일간의 모든 날짜 초기화
  for (let i = 0; i < 14; i++) {
    const date = DateTime.now().minus({ days: i });
    const dateStr = date.toFormat("yyyy-MM-dd");
    dailyStatsMap.set(dateStr, {
      posts: 0,
      total_likes: 0,
      total_shares: 0,
      total_comments: 0,
      total_views: 0,
    });
  }

  // 실제 데이터로 채우기
  threads?.forEach((thread) => {
    const date = DateTime.fromISO(thread.created_at, { zone: "Asia/Seoul" });
    const dateStr = date.toFormat("yyyy-MM-dd");
    const existing = dailyStatsMap.get(dateStr);

    if (existing) {
      existing.posts += 1;
      existing.total_likes += thread.like_cnt || 0;
      existing.total_shares += thread.share_cnt || 0;
      existing.total_comments += thread.comment_cnt || 0;
      existing.total_views += thread.view_cnt || 0;
    }
  });

  // 최신순으로 정렬된 일별 통계
  const dailyStats = Array.from(dailyStatsMap.entries())
    .map(([date, stats]) => ({ date, ...stats }))
    .sort((a, b) => b.date.localeCompare(a.date));

  // 평균값 계산 (전체 기간)
  const totalPosts = threads?.length || 0;
  const totalLikes =
    threads?.reduce((sum, t) => sum + (t.like_cnt || 0), 0) || 0;
  const totalShares =
    threads?.reduce((sum, t) => sum + (t.share_cnt || 0), 0) || 0;
  const totalComments =
    threads?.reduce((sum, t) => sum + (t.comment_cnt || 0), 0) || 0;
  const totalViews =
    threads?.reduce((sum, t) => sum + (t.view_cnt || 0), 0) || 0;

  const averages = {
    posts: totalPosts > 0 ? Math.round(totalPosts / 14) : 0, // 14일 평균
    likes: totalPosts > 0 ? Math.round(totalLikes / totalPosts) : 0, // 게시글당 평균
    shares: totalPosts > 0 ? Math.round(totalShares / totalPosts) : 0,
    comments: totalPosts > 0 ? Math.round(totalComments / totalPosts) : 0,
    views: totalPosts > 0 ? Math.round(totalViews / totalPosts) : 0,
    followers: 0, // 일단 0으로 설정, 나중에 별도 계산
  };

  return {
    averages,
    dailyStats,
  };
}

export async function getUserList(client: SupabaseClient<Database>) {
  const { data, error } = await client.from("profiles").select("profile_id");

  if (error) {
    throw error;
  }

  return data;
}

export async function getFollowersCount(
  client: SupabaseClient<Database>,
  { profileId, threadId }: { profileId: string; threadId: number },
) {
  const { data, error } = await client
    .from("followers_history")
    .select("follower_count")
    .eq("profile_id", profileId)
    .eq("thread_id", threadId)
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) {
    return null;
  }
  return data;
}
