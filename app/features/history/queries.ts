import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

// 글목록 조회 (페이징 + 검색)
export async function getThreadsList(
  client: SupabaseClient<Database>,
  userId: string,
  {
    page = 1,
    limit = 20,
    search = "",
  }: {
    page?: number;
    limit?: number;
    search?: string;
  } = {},
) {
  const offset = (page - 1) * limit;

  let query = client
    .from("threads")
    .select(
      `
      thread_id,
      short_text,
      thread,
      target_type,
      send_flag,
      result_id,
      share_cnt,
      like_cnt,
      comment_cnt,
      view_cnt,
      now_follow_cnt,
      created_at,
      updated_at
    `,
    )
    .eq("profile_id", userId)
    .order("created_at", { ascending: false });

  // 검색 조건 추가
  if (search.trim()) {
    query = query.or(`short_text.ilike.%${search}%,thread.ilike.%${search}%`);
  }

  // 페이징 적용
  const { data: threads, error } = await query.range(
    offset,
    offset + limit - 1,
  );

  if (error) {
    console.error("Error fetching threads:", error);
    throw error;
  }

  // 전체 개수 조회
  let countQuery = client
    .from("threads")
    .select("thread_id", { count: "exact" })
    .eq("profile_id", userId);

  if (search.trim()) {
    countQuery = countQuery.or(
      `short_text.ilike.%${search}%,thread.ilike.%${search}%`,
    );
  }

  const { count, error: countError } = await countQuery;

  if (countError) {
    console.error("Error counting threads:", countError);
    throw countError;
  }

  return {
    threads: threads || [],
    totalCount: count || 0,
    hasMore: (count || 0) > offset + limit,
    currentPage: page,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

// 글 상세 조회
export async function getThreadDetail(
  client: SupabaseClient<Database>,
  threadId: string,
) {
  const threadIdNum = Number(threadId);
  if (isNaN(threadIdNum)) {
    throw new Error("Invalid thread ID");
  }
  const { data: thread, error } = await client
    .from("threads")
    .select(
      `
      thread_id,
      short_text,
      thread,
      target_type,
      send_flag,
      result_id,
      share_cnt,
      like_cnt,
      comment_cnt,
      view_cnt,
      now_follow_cnt,
      created_at,
      updated_at,
      keywords!inner (
        keyword_id,
        keyword
      ),
      properties!inner (
        property_id,
        property_type,
        property
      ),
      thread_media (
        media_id,
        media_type,
        original_filename,
        public_url,
        file_size,
        mime_type,
        storage_path,
        created_at
      )
    `,
    )
    .eq("thread_id", threadIdNum)
    .single();
  if (error) {
    console.error("Error fetching thread detail:", error);
    throw error;
  }
  return thread;
}

// 팔로워 수 증감 계산
export async function getFollowerChange(
  client: SupabaseClient<Database>,
  threadId: string,
) {
  const threadIdNum = Number(threadId);
  if (isNaN(threadIdNum)) {
    throw new Error("Invalid thread ID");
  }
  // 1. 게시글 작성 시점의 팔로워 수 (threads 테이블의 now_follow_cnt - 기준점)
  const { data: thread, error: threadError } = await client
    .from("threads")
    .select("profile_id, now_follow_cnt, created_at")
    .eq("thread_id", threadIdNum)
    .single();
  if (threadError || !thread) {
    throw new Error("Thread not found");
  }
  // 2. 현재 팔로워 수 (user_insights의 최신 followers_count)
  const { data: currentInsight, error: currentError } = await client
    .from("user_insights")
    .select("value")
    .eq("profile_id", thread.profile_id!)
    .eq("metric_name", "followers_count")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  // 현재 팔로워 수가 없으면 게시글 작성 시점의 팔로워 수 사용
  const currentFollowers = currentInsight?.value || thread.now_follow_cnt;
  const baselineFollowers = thread.now_follow_cnt; // 게시글 작성 시점의 팔로워 수
  // 3. 증감 계산
  const followerChange = currentFollowers - baselineFollowers;
  return {
    currentFollowers,
    baselineFollowers,
    followerChange,
    isPositive: followerChange > 0,
    isNegative: followerChange < 0,
    isNeutral: followerChange === 0,
  };
}

// 키워드 검색 (자동완성용)
export async function searchKeywords(
  client: SupabaseClient<Database>,
  userId: string,
  searchTerm: string,
  limit = 10,
) {
  const { data, error } = await client
    .from("keywords")
    .select("keyword_id, keyword")
    .ilike("keyword", `%${searchTerm}%`)
    .limit(limit);

  if (error) {
    console.error("Error searching keywords:", error);
    throw error;
  }

  return data || [];
}

// 속성 검색 (자동완성용)
export async function searchProperties(
  client: SupabaseClient<Database>,
  searchTerm: string,
  limit = 10,
) {
  const { data, error } = await client
    .from("properties")
    .select("property_id, property_type, property")
    .ilike("property", `%${searchTerm}%`)
    .limit(limit);

  if (error) {
    console.error("Error searching properties:", error);
    throw error;
  }

  return data || [];
}
