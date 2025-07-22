import { type LoaderFunctionArgs, redirect } from "react-router";

import makeServerClient from "~/core/lib/supa-client.server";
import { insertAccessToken } from "~/features/settings/mutations";

// Threads API 설정 (실제 값으로 교체 필요)
const THREADS_CLIENT_ID =
  process.env.THREADS_CLIENT_ID || "your_threads_client_id";
const THREADS_CLIENT_SECRET =
  process.env.THREADS_CLIENT_SECRET || "your_threads_client_secret";

// 개발일때와 운영일때 분리해서 처리
const REDIRECT_URI = process.env.THREADS_REDIRECT_URI || "redirect_uri";

export async function loader({ request }: LoaderFunctionArgs) {
  // get code from url
  const url = new URL(request.url);
  // url 끝에 #_ 제거
  const urlWithoutHash = new URL(url.toString().replace("#_", ""));
  const code = urlWithoutHash.searchParams.get("code");
  const error = urlWithoutHash.searchParams.get("error");
  const errorReason = urlWithoutHash.searchParams.get("error_reason");
  const errorDescription = urlWithoutHash.searchParams.get("error_description");

  if (error) {
    console.log("error", error);
    console.log("errorReason", errorReason);
    console.log("errorDescription", errorDescription);
    return redirect(
      `/dashboard/sns/connect?platform=threads&status=error&error=${error}&errorReason=${errorReason}&errorDescription=${errorDescription}`,
    );
  }

  // 인증코드 발급 (post)
  const formData = new FormData();
  formData.append("client_id", THREADS_CLIENT_ID);
  formData.append("client_secret", THREADS_CLIENT_SECRET);
  formData.append("grant_type", "authorization_code");
  formData.append("redirect_uri", REDIRECT_URI);
  formData.append("code", code || "");

  const response = await fetch("https://graph.threads.net/oauth/access_token", {
    method: "POST",
    body: formData,
  });

  // 성공인 경우 access_token, user_id 반환
  // 거부가된 경우 error_type, code, error_message 반환
  const data = await response.json();
  console.log("data", data);

  if (!response.ok) {
    console.error("Threads API Error:", data);
    return redirect(
      `/dashboard/sns/connect?platform=threads&status=error&error=${data.code}&errorReason=${data.error_message}`,
    );
  }

  // 장기 실행 토큰 가져오기
  const longLivedToken = await getAccessToken(data.access_token);

  if (longLivedToken.access_token) {
    const profileId = await getProfileId(longLivedToken.access_token);
    console.log("profileId", profileId);
    // 데이터베이스에 토큰 저장
    const [client] = makeServerClient(request);
    const {
      data: { user },
    } = await client.auth.getUser();

    try {
      await insertAccessToken(client, {
        userId: user!.id,
        accessToken: longLivedToken.access_token,
        expiresIn: longLivedToken.expires_in,
        targetType: "thread",
        snsId: profileId.id,
      });
      console.log("Access token saved to database");
      return redirect("/dashboard/sns/connect?platform=threads&status=success");
    } catch (error) {
      console.error("Error saving access token:", error);
      return redirect("/dashboard/sns/connect?platform=threads&status=error");
    }
  } else {
    console.error("Long-lived token not found");
    return redirect("/dashboard/sns/connect?platform=threads&status=error");
  }
}

// 장기 실행 토큰은 60일간 지속됨
const getAccessToken = async (token: string) => {
  const accessTokenUrl =
    `https://graph.threads.net/access_token?` +
    `grant_type=th_exchange_token&` +
    `client_secret=${THREADS_CLIENT_SECRET}&` +
    `access_token=${token}`;

  const response = await fetch(accessTokenUrl, {
    method: "GET",
  });

  const data = await response.json();
  return data;
};

// 프로필 정보 가져오기
const getProfileId = async (token: string) => {
  /*
  curl -s -X GET \
"https://graph.threads.net/v1.0/me?fields=id,username,name,threads_profile_picture_url,threads_biography&access_token=$THREADS_ACCESS_TOKEN"
  */

  const profileIdUrl = `https://graph.threads.net/v1.0/me?fields=id&access_token=${token}`;

  const response = await fetch(profileIdUrl, {
    method: "GET",
  });

  const data = await response.json();
  return data;
};
