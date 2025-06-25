import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";

import { data, redirect } from "react-router";

// Threads API 설정 (실제 값으로 교체 필요)
const THREADS_CLIENT_ID =
  process.env.THREADS_CLIENT_ID || "your_threads_client_id";
const THREADS_CLIENT_SECRET =
  process.env.THREADS_CLIENT_SECRET || "your_threads_client_secret";
const REDIRECT_URI =
  "https://localhost:5173/api/settings/threads-auth/callback";

export async function loader({ request }: LoaderFunctionArgs) {
  const authUrl =
    `https://threads.net/oauth/authorize?` +
    `client_id=${THREADS_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
    `scope=threads_basic,threads_content_publish&` +
    `response_type=code&` +
    `state=${generateRandomState()}`;
  return redirect(authUrl);
}

function generateRandomState(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}
