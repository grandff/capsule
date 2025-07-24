import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";

import { data, redirect } from "react-router";

// Threads API 설정 (실제 값으로 교체 필요)
const THREADS_CLIENT_ID =
  process.env.THREADS_CLIENT_ID || "your_threads_client_id";
const THREADS_CLIENT_SECRET =
  process.env.THREADS_CLIENT_SECRET || "your_threads_client_secret";

// 개발일때와 운영일때 분리해서 처리
const REDIRECT_URI = process.env.THREADS_REDIRECT_URI || "redirect_uri";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const fromOnboarding = url.searchParams.get("from") === "onboarding";

  // 온보딩에서 온 경우 state를 "onboarding"으로 설정
  const state = fromOnboarding ? "onboarding" : generateRandomState();

  const authUrl =
    `https://threads.net/oauth/authorize?` +
    `client_id=${THREADS_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
    `scope=threads_basic,threads_content_publish,threads_manage_insights,threads_read_replies,threads_keyword_search&` +
    `response_type=code&`;
  //+`state=${state}`;
  return redirect(authUrl);
}

function generateRandomState(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}
