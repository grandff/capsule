import type { SupabaseClient } from "@supabase/supabase-js";

import { DateTime } from "luxon";
import { data } from "react-router";

import { deleteAccessToken, updateThreadsAccessToken } from "../mutations";
import { getThreadsAccessToken } from "../queries";

interface ApiResponse {
  success: boolean;
  error: string;
}

// 토큰 재발급 캐시 (하루 유효기간)
const tokenRefreshCache = new Map<
  string,
  { timestamp: number; userId: string }
>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24시간

export async function refreshToken(
  client: SupabaseClient,
  userId: string,
): Promise<ApiResponse> {
  // 캐시 확인 - 하루 내에 이미 재발급했다면 스킵
  const cached = tokenRefreshCache.get(userId);
  if (cached) {
    const now = Date.now();
    if (now - cached.timestamp < CACHE_DURATION) {
      return { success: false, error: "Already refreshed today" };
    }
  }

  // 토큰 정보 조회
  const { accessToken, expiresAt, updatedAt } = await getThreadsAccessToken(
    client,
    userId,
  );

  if (!accessToken || !expiresAt) {
    return { success: false, error: "Token not found" };
  }

  // 토큰이 만료 됐다면 데이터 제거 luxon 활용
  const expiresAtDate = DateTime.fromISO(expiresAt);
  const now = DateTime.now();
  if (expiresAtDate.diff(now).toMillis() < 0) {
    await deleteAccessToken(client, { userId: userId, targetType: "thread" });
    return { success: false, error: "Token expired" };
  }

  // 만약 updateAt 기준으로 이미 토큰이 발급되어 있다면 새로고침 안함
  const updatedAtDate = DateTime.fromISO(updatedAt);
  if (updatedAtDate.diff(now).toMillis() > 0) {
    return { success: false, error: "Token already refreshed" };
  }

  // 토큰 재발급 요청
  const response = await fetch(
    `https://graph.threads.net/refresh_access_token?grant_type=th_refresh_token&access_token=${accessToken}`,
  );
  console.log("요청 : ", response);

  const tokenResponse = await response.json();
  await updateThreadsAccessToken(client, {
    userId: userId,
    accessToken: tokenResponse.access_token,
    expiresIn: tokenResponse.expires_in,
  });

  // 성공 시 캐시에 저장 (하루 유효기간)
  tokenRefreshCache.set(userId, {
    timestamp: Date.now(),
    userId: userId,
  });
  console.log("토큰 재발급 성공 및 캐시 저장:", userId);

  return { success: true, error: "" };
}
