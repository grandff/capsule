/**
 * Delete Account API Endpoint
 *
 * This file implements an API endpoint for completely deleting a user's account.
 * It handles authentication checks, user deletion from Supabase Auth, and cleanup
 * of associated storage resources.
 *
 * Key features:
 * - Request method validation (DELETE only)
 * - Authentication protection
 * - Complete user deletion from Supabase Auth
 * - Cleanup of user avatar from storage
 * - Redirection to home page after successful deletion
 * - Error handling for API errors
 */
import type { Route } from "./+types/delete-account";

import { redirect } from "react-router";

import { requireAuthentication } from "~/core/lib/guards.server";
import adminClient from "~/core/lib/supa-admin-client.server";
import makeServerClient from "~/core/lib/supa-client.server";

import { deleteUserAccount } from "../mutations";

export async function action({ request }: Route.ActionArgs) {
  const [client, headers] = makeServerClient(request);
  const user = await requireAuthentication(client);
  try {
    if (!user) {
      return { success: false, error: "사용자 인증에 실패했습니다." };
    }

    // 회원탈퇴 처리
    await deleteUserAccount(client, user.id);
    await adminClient.auth.admin.deleteUser(user.id);

    // 로그아웃 처리
    await client.auth.signOut();

    // 홈페이지로 리다이렉트
    return redirect("/", { headers });
  } catch (error) {
    console.error("회원탈퇴 중 오류:", error);
    return { success: false, error: "회원탈퇴 처리 중 오류가 발생했습니다." };
  }
}
