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
    .from("profiles")
    .select("threads_access_token, threads_expires_at, threads_connect")
    .eq("profile_id", userId)
    .single();

  if (error) {
    console.error("Error fetching access token:", error);
    throw error;
  }

  if (!data?.threads_access_token || !data?.threads_connect) {
    return null;
  }

  // 토큰 복호화하여 반환
  try {
    const decryptedToken = decryptToken(data.threads_access_token);
    return {
      accessToken: decryptedToken,
      expiresAt: data.threads_expires_at,
      isConnected: data.threads_connect,
    };
  } catch (error) {
    console.error("Error decrypting token:", error);
    return null;
  }
}

// 연결 상태만 확인 (클라이언트에서 사용 가능)
export async function getConnectionStatus(
  client: SupabaseClient<Database>,
  userId: string,
) {
  const { data, error } = await client
    .from("profiles")
    .select("threads_connect, threads_expires_at")
    .eq("profile_id", userId)
    .single();

  if (error) {
    console.error("Error fetching connection status:", error);
    return { isConnected: false, isExpired: false };
  }

  if (!data?.threads_connect) {
    return { isConnected: false, isExpired: false };
  }

  // 만료 확인
  let isExpired = false;
  if (data.threads_expires_at) {
    const expiresAt = DateTime.fromISO(data.threads_expires_at);
    isExpired = DateTime.now() > expiresAt;
  }

  return {
    threadsConnected: data.threads_connect && !isExpired,
    threadsExpired: isExpired,
  };
}

// TODO 토큰 만료 확인
