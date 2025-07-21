/**
 * App Redirect Utilities Module
 *
 * This module provides utility functions for handling automatic redirects
 * when requests come from the mobile app. It ensures that app users are
 * directed to the appropriate pages based on their authentication status.
 *
 * The module handles:
 * - Automatic redirection for app requests
 * - Authentication-based routing for mobile app users
 * - Consistent app navigation patterns
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import { redirect } from "react-router";

import { getUserProfile } from "~/features/users/queries";

import { detectAppRequest } from "./guards.server";

/**
 * Handle app-specific redirects based on authentication status
 *
 * This function checks if the request is from the mobile app and automatically
 * redirects users to appropriate pages based on their authentication status.
 *
 * - If user is authenticated and has a profile: redirect to dashboard
 * - If user is authenticated but no profile: redirect to profile setup
 * - If user is not authenticated: redirect to login
 * - If not an app request: return null (no redirect needed)
 *
 * @example
 * // In a loader function
 * export async function loader({ request }: LoaderArgs) {
 *   const [client] = makeServerClient(request);
 *
 *   // Check for app redirects first
 *   const appRedirect = await handleAppRedirect(request, client);
 *   if (appRedirect) return appRedirect;
 *
 *   // Continue with normal loader logic...
 *   return { data: 'normal-data' };
 * }
 *
 * @param request - The incoming request object
 * @param client - The Supabase client instance
 * @returns Response object for redirect or null if no redirect needed
 */
export async function handleAppRedirect(
  request: Request,
  client: SupabaseClient,
): Promise<Response | null> {
  // 앱 요청이 아닌 경우 리다이렉트하지 않음
  if (!detectAppRequest(request)) {
    return null;
  }

  // 사용자 인증 상태 확인
  const {
    data: { user },
  } = await client.auth.getUser();

  if (user) {
    // 로그인된 사용자인 경우 프로필 확인
    const profile = await getUserProfile(client, {
      userId: user.id,
    });

    if (profile) {
      // 프로필이 있는 경우 대시보드로 리다이렉트
      return redirect("/dashboard");
    } else {
      // 프로필이 없는 경우 프로필 설정 페이지로 리다이렉트
      return redirect("/account");
    }
  } else {
    // 로그인되지 않은 사용자인 경우 로그인 페이지로 리다이렉트
    return redirect("/login");
  }
}

/**
 * Handle app-specific redirects with custom logic
 *
 * This function provides more flexible app redirect handling with custom
 * logic for different scenarios.
 *
 * @param request - The incoming request object
 * @param client - The Supabase client instance
 * @param options - Custom redirect options
 * @returns Response object for redirect or null if no redirect needed
 */
export async function handleAppRedirectWithOptions(
  request: Request,
  client: SupabaseClient,
  options: {
    authenticatedRedirect?: string;
    unauthenticatedRedirect?: string;
    noProfileRedirect?: string;
    skipRedirectForWeb?: boolean;
  } = {},
): Promise<Response | null> {
  const {
    authenticatedRedirect = "/dashboard",
    unauthenticatedRedirect = "/login",
    noProfileRedirect = "/account",
    skipRedirectForWeb = true,
  } = options;

  // 앱 요청이 아닌 경우 리다이렉트하지 않음
  if (!detectAppRequest(request)) {
    return skipRedirectForWeb ? null : redirect("/");
  }

  // 사용자 인증 상태 확인
  const {
    data: { user },
  } = await client.auth.getUser();

  if (user) {
    // 로그인된 사용자인 경우 프로필 확인
    const profile = await getUserProfile(client, {
      userId: user.id,
    });

    if (profile) {
      // 프로필이 있는 경우 지정된 페이지로 리다이렉트
      return redirect(authenticatedRedirect);
    } else {
      // 프로필이 없는 경우 프로필 설정 페이지로 리다이렉트
      return redirect(noProfileRedirect);
    }
  } else {
    // 로그인되지 않은 사용자인 경우 로그인 페이지로 리다이렉트
    return redirect(unauthenticatedRedirect);
  }
}

/**
 * Check if app should redirect to a specific page
 *
 * This function checks if the current request should redirect based on
 * app detection and authentication status, without performing the redirect.
 *
 * @param request - The incoming request object
 * @param client - The Supabase client instance
 * @returns Object containing redirect information
 */
export async function checkAppRedirect(
  request: Request,
  client: SupabaseClient,
): Promise<{
  shouldRedirect: boolean;
  redirectTo: string | null;
  reason: string | null;
}> {
  // 앱 요청이 아닌 경우 리다이렉트하지 않음
  if (!detectAppRequest(request)) {
    return {
      shouldRedirect: false,
      redirectTo: null,
      reason: null,
    };
  }

  // 사용자 인증 상태 확인
  const {
    data: { user },
  } = await client.auth.getUser();

  if (user) {
    // 로그인된 사용자인 경우 프로필 확인
    const profile = await getUserProfile(client, {
      userId: user.id,
    });

    if (profile) {
      return {
        shouldRedirect: true,
        redirectTo: "/dashboard",
        reason: "authenticated_with_profile",
      };
    } else {
      return {
        shouldRedirect: true,
        redirectTo: "/account",
        reason: "authenticated_no_profile",
      };
    }
  } else {
    return {
      shouldRedirect: true,
      redirectTo: "/login",
      reason: "unauthenticated",
    };
  }
}
