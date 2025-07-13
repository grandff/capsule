import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";

import makeServerClient from "~/core/lib/supa-client.server";
import { getThreadsAccessToken } from "~/features/settings/queries";
import { markThreadAsDeleted } from "~/features/write/mutations";

const THREAD_END_POINT_URL = "https://graph.threads.net/v1.0";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const resultId = params.id;

  if (!resultId) {
    throw new Response("Result ID is required", { status: 400 });
  }

  // get access token from user id
  const [client, headers] = makeServerClient(request);
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) {
    throw new Response("Unauthorized", { status: 401 });
  }
  const userId = user.id;
  const { accessToken, expiresAt } = await getThreadsAccessToken(
    client,
    userId,
  );
  if (!accessToken || !expiresAt) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const retrieveUrl =
    `${THREAD_END_POINT_URL}/${resultId}?` +
    `fields=id&` +
    `access_token=${accessToken}`;

  try {
    const response = await fetch(retrieveUrl);
    const data = await response.json();

    // 게시글을 찾을 수 없는 경우
    if (
      data.error &&
      data.error.code === 100 &&
      data.error.error_subcode === 33
    ) {
      // thread_id를 찾기 위해 result_id로 조회
      const { data: threadData } = await client
        .from("threads")
        .select("thread_id")
        .eq("result_id", resultId)
        .single();

      if (threadData) {
        // result_id를 "DELETED"로 업데이트
        await markThreadAsDeleted(client, threadData.thread_id);
      }

      return {
        success: false,
        data: null,
        message:
          "게시글을 찾을 수 없습니다. 삭제되었거나 접근 권한이 없습니다.",
      };
    }

    // 성공적인 경우
    return {
      success: true,
      data: data,
      message: "게시글 조회 성공",
    };
  } catch (error) {
    console.error("Error retrieving user posts:", error);
    return {
      success: false,
      data: null,
      message: "게시글 조회 중 오류가 발생했습니다.",
    };
  }
}
