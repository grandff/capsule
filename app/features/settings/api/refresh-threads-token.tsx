import { DateTime } from "luxon";
import { type LoaderFunctionArgs, data } from "react-router";

import makeServerClient from "~/core/lib/supa-client.server";

import { deleteAccessToken, updateThreadsAccessToken } from "../mutations";
import { getThreadsAccessToken } from "../queries";

export async function loader({ request }: LoaderFunctionArgs) {
  // 사용자 토큰 조회
  const [client] = makeServerClient(request);
  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    return data({ error: "User not found" }, { status: 404 });
  }

  // 토큰 정보 조회
  console.log("[refresh-threads-token] getThreadsAccessToken 호출");
  const { accessToken, expiresAt, updatedAt } = await getThreadsAccessToken(
    client,
    user.id,
  );

  if (!accessToken || !expiresAt) {
    return data({ error: "Token not found" }, { status: 404 });
  }

  // 토큰이 만료 됐다면 데이터 제거 luxon 활용
  const expiresAtDate = DateTime.fromISO(expiresAt);
  const now = DateTime.now();
  if (expiresAtDate.diff(now).toMillis() < 0) {
    await deleteAccessToken(client, { userId: user.id, targetType: "thread" });
    return data({ error: "Token expired" }, { status: 403 });
  }

  // 만약 updateAt 기준으로 이미 토큰이 발급되어 있다면 새로고침 안함
  const updatedAtDate = DateTime.fromISO(updatedAt);
  if (updatedAtDate.diff(now).toMillis() > 0) {
    return data({ error: "Token already refreshed" }, { status: 200 });
  }

  // 토큰 재발급 요청
  const response = await fetch(
    `https://graph.threads.net/refresh_access_token?grant_type=th_refresh_token&access_token=${accessToken}`,
  );

  const tokenResponse = await response.json();
  await updateThreadsAccessToken(client, {
    userId: user.id,
    accessToken: tokenResponse.access_token,
    expiresIn: tokenResponse.expires_in,
  });
  return data({ success: true }, { status: 200 });
}
