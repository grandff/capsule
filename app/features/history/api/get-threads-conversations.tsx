import type { LoaderFunctionArgs } from "react-router";

import { CACHE_TTL, cacheKeys, cachedApiCall } from "~/core/lib/cache";
import makeServerClient from "~/core/lib/supa-client.server";
import { getThreadsAccessToken } from "~/features/settings/queries";

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
  console.log("[get-threads-conversations] getThreadsAccessToken 호출");
  const { accessToken, expiresAt } = await getThreadsAccessToken(
    client,
    userId,
  );
  if (!accessToken || !expiresAt) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const cacheKey = cacheKeys.mentions(parseInt(resultId, 10));

  return await cachedApiCall(cacheKey, CACHE_TTL.MENTIONS, async () => {
    const retrieveUrl =
      `${THREAD_END_POINT_URL}/${resultId}/conversation?` +
      `id,text,timestamp,media_product_type,media_type,media_url,shortcode,thumbnail_url,children,has_replies,root_post,replied_to,is_reply,hide_status&reverse=false&` +
      `access_token=${accessToken}`;

    const response = await fetch(retrieveUrl);
    const data = await response.json();
    console.log("Threads Conversations API response:", data);
    return data;
  });
}
