import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

import { DateTime } from "luxon";

import { decryptToken, encryptToken } from "~/utils/crypto-util";

// 쓰레드 토큰 저장
export async function insertAccessToken(
  client: SupabaseClient<Database>,
  {
    userId,
    accessToken,
    expiresIn,
    targetType,
    snsId,
  }: {
    userId: string;
    accessToken: string;
    expiresIn: number;
    targetType: "thread" | "X";
    snsId: string;
  },
) {
  // expires_in은 초 단위이므로 현재 시간에 더해서 만료 시간 계산
  // Luxon을 사용해서 더 정확한 날짜 처리
  const expiresAt = DateTime.now().plus({ seconds: expiresIn });

  // 액세스 토큰 암호화
  const encryptedToken = encryptToken(accessToken);

  const { data, error } = await client
    .from("sns_profiles")
    .upsert({
      access_token: encryptedToken, // 암호화된 토큰 저장
      expires_at: expiresAt.toISO(),
      target_type: targetType,
      user_id: snsId,
      profile_id: userId,
    })
    .eq("profile_id", userId)
    .select();

  if (error) {
    console.error("Error updating access token:", error);
    throw error;
  }

  return data;
}

// 쓰레드 토큰 제거
export async function deleteAccessToken(
  client: SupabaseClient<Database>,
  { userId, targetType }: { userId: string; targetType: "thread" | "X" },
) {
  const { error } = await client
    .from("sns_profiles")
    .delete()
    .eq("profile_id", userId)
    .eq("target_type", targetType)
    .select();

  if (error) {
    console.error("Error deleting access token:", error);
    throw error;
  }
}

// 설정 저장
export async function saveSetting(
  client: SupabaseClient<Database>,
  {
    userId,
    theme,
    fontSize,
    blindMode,
  }: {
    userId: string;
    theme: string;
    fontSize: string;
    blindMode: boolean;
  },
) {
  const { data, error } = await client.from("setting").upsert({
    profile_id: userId,
    theme,
    font_size: fontSize,
    color_blind_mode: blindMode,
  });

  if (error) {
    console.error("Error saving setting:", error);
    throw error;
  }
}
