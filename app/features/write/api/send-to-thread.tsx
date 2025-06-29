import { type ActionFunctionArgs, data } from "react-router";

import makeServerClient from "~/core/lib/supa-client.server";
import { getThreadsAccessToken } from "~/features/settings/queries";

const THREAD_END_POINT_URL = "https://graph.threads.net/v1.0";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const text = formData.get("text") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const videoUrl = formData.get("videoUrl") as string;

  // 로그인한 사용자 정보 가져오기
  const [client] = makeServerClient(request);
  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    return data({ error: "User not found" }, { status: 401 });
  }

  // 토큰 정보 가져오기
  const { accessToken, expiresAt, snsId } = await getThreadsAccessToken(
    client,
    user.id,
  );

  if (!accessToken) {
    return data({ error: "Access token not found" }, { status: 401 });
  }

  // 쓰레드 컨테이너 생성
  const { id: containerId } = await threads(
    user.id,
    text,
    accessToken,
    imageUrl,
    videoUrl,
  );

  // 쓰레드 게시
  const { id: threadId } = await threadsPublish(
    user.id,
    containerId,
    accessToken,
  );

  // TODO 결과값을 write 테이블에도 저장

  return data({ threadId }, { status: 200 });
}

const threads = async (
  userId: string,
  text: string,
  accessToken: string,
  imageUrl?: string,
  videoUrl?: string,
) => {
  const formData = new FormData();
  formData.append(
    "media_type",
    videoUrl ? "VIDEO" : imageUrl ? "IMAGE" : "TEXT",
  );
  formData.append("image_url", imageUrl || "");
  formData.append("video_url", videoUrl || "");
  formData.append("text", text);
  formData.append("access_token", accessToken);

  const response = await fetch(`${THREAD_END_POINT_URL}/${userId}/threads`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  return data; // return thread media container Id
};

const threadsPublish = async (
  userId: string,
  containerId: string,
  accessToken: string,
) => {
  const formData = new FormData();
  formData.append("creation_id", containerId);
  formData.append("access_token", accessToken);

  const response = await fetch(
    `${THREAD_END_POINT_URL}/${userId}/threads_publish`,
    {
      method: "POST",
      body: formData,
    },
  );

  const data = await response.json();
  return data; // return thread media Id
};
