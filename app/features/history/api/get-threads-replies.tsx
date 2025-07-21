import type { LoaderFunctionArgs } from "react-router";

import makeServerClient from "~/core/lib/supa-client.server";
import { getThreadsAccessToken } from "~/features/settings/queries";

const THREAD_END_POINT_URL = "https://graph.threads.net/v1.0";

interface ThreadReply {
  id: string;
  text: string;
  timestamp: string;
  media_product_type: string;
  media_type: string;
  shortcode: string;
  has_replies: boolean;
  root_post: {
    id: string;
  };
  replied_to: {
    id: string;
  };
  is_reply: boolean;
  hide_status: "NOT_HUSHED" | "HIDDEN" | "UNHUSHED";
}

interface ThreadRepliesResponse {
  data: ThreadReply[];
  paging: {
    cursors: {
      before: string;
      after: string;
    };
  };
}

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
  console.log("[get-threads-replies] getThreadsAccessToken 호출");
  const { accessToken, expiresAt } = await getThreadsAccessToken(
    client,
    userId,
  );
  if (!accessToken || !expiresAt) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const retrieveUrl =
    `${THREAD_END_POINT_URL}/${resultId}/replies?` +
    `fields=id,text,timestamp,media_product_type,media_type,shortcode,has_replies,root_post,replied_to,is_reply,hide_status&reverse=false&` +
    `access_token=${accessToken}`;

  const response = await fetch(retrieveUrl);
  const data = (await response.json()) as ThreadRepliesResponse;
  return data;
}
