import type { ActionFunctionArgs } from "react-router";

import { data, redirect } from "react-router";

// Threads API 설정 (실제 값으로 교체 필요)
const THREADS_CLIENT_ID =
  process.env.THREADS_CLIENT_ID || "your_threads_client_id";
const THREADS_CLIENT_SECRET =
  process.env.THREADS_CLIENT_SECRET || "your_threads_client_secret";
const REDIRECT_URI = "http://localhost:3000/dashboard/sns/connect/callback";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action = formData.get("action");

  if (action === "connect") {
    // Threads OAuth 인증 URL로 리다이렉트
    const authUrl =
      `https://www.threads.net/api/oauth/authorize?` +
      `client_id=${THREADS_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
      `scope=basic&` +
      `response_type=code&` +
      `state=${generateRandomState()}`;

    return redirect(authUrl);
  }

  if (action === "disconnect") {
    // 연결 해제 로직
    // 실제로는 데이터베이스에서 토큰 삭제
    return redirect("/dashboard/sns/connect");
  }

  if (action === "callback") {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");

    if (error) {
      return redirect("/dashboard/sns/connect?error=oauth_error");
    }

    if (!code) {
      return redirect("/dashboard/sns/connect?error=no_code");
    }

    try {
      // 액세스 토큰 교환
      const tokenResponse = await exchangeCodeForToken(code);

      if (tokenResponse.access_token) {
        // 사용자 정보 가져오기
        const userInfo = await getUserInfo(tokenResponse.access_token);

        // 데이터베이스에 토큰 저장 (실제 구현 필요)
        // await saveThreadsToken(userId, tokenResponse.access_token, userInfo);

        return redirect("/dashboard/sns/connect?success=connected");
      } else {
        return redirect("/dashboard/sns/connect?error=token_exchange_failed");
      }
    } catch (error) {
      console.error("Threads OAuth error:", error);
      return redirect("/dashboard/sns/connect?error=oauth_failed");
    }
  }

  return data({ error: "Invalid action" }, { status: 400 });
}

async function exchangeCodeForToken(code: string) {
  const response = await fetch(
    "https://www.threads.net/api/oauth/access_token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: THREADS_CLIENT_ID,
        client_secret: THREADS_CLIENT_SECRET,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URI,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Token exchange failed: ${response.statusText}`);
  }

  return response.json();
}

async function getUserInfo(accessToken: string) {
  const response = await fetch("https://www.threads.net/api/v1/users/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get user info: ${response.statusText}`);
  }

  return response.json();
}

function generateRandomState(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}
