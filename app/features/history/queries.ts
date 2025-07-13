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
  userId: string,
  threadId: number,
) {
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
      )
    `,
    )
    .eq("profile_id", userId)
    .eq("thread_id", threadId)
    .single();

  if (error) {
    console.error("Error fetching thread detail:", error);
    throw error;
  }

  return thread;
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
