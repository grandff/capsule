import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

import { DateTime } from "luxon";

import { decryptToken } from "~/utils/crypto-util";

// 토큰 가져오기 (서버 사이드에서만 사용)
export async function getThreadsAccessToken(
  client: SupabaseClient<Database>,
  userId: string,
) {
  const { data, error } = await client
    .from("sns_profiles")
    .select("access_token, expires_at, target_type, user_id")
    .eq("profile_id", userId)
    .eq("target_type", "thread")
    .single();

  if (error) {
    console.error("Error fetching access token:", error);
    return {
      accessToken: null,
      expiresAt: null,
      snsId: null,
    };
  }

  if (!data?.access_token) {
    return {
      accessToken: null,
      expiresAt: null,
      snsId: null,
    };
  }

  // 토큰 복호화하여 반환
  try {
    const decryptedToken = decryptToken(data.access_token);
    return {
      accessToken: decryptedToken,
      expiresAt: data.expires_at,
      snsId: data.user_id,
    };
  } catch (error) {
    console.error("Error decrypting token:", error);
    return {
      accessToken: null,
      expiresAt: null,
      snsId: null,
    };
  }
}

// 연결 상태만 확인 (클라이언트에서 사용 가능)
export async function getConnectionStatus(
  client: SupabaseClient<Database>,
  userId: string,
) {
  const { data, error } = await client
    .from("sns_profiles")
    .select("target_type, expires_at")
    .eq("profile_id", userId)
    .single();

  if (error) {
    return { isConnected: false, isExpired: false };
  }

  // 만료 확인
  let isExpired = false;
  if (data.expires_at) {
    const expiresAt = DateTime.fromISO(data.expires_at);
    isExpired = DateTime.now() > expiresAt;
  }

  return {
    threadsConnected: data.target_type === "thread" && !isExpired,
    threadsExpired: isExpired,
  };
}

// TODO 토큰 만료 확인

// 현재 설정 정보 확인
export async function getSetting(
  client: SupabaseClient<Database>,
  userId: string,
) {
  const { data, error } = await client
    .from("setting")
    .select("theme, font_size, color_blind_mode")
    .eq("profile_id", userId)
    .single();

  if (error) {
    return null;
  }

  return data;
}
