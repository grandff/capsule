import type { ActionFunctionArgs } from "react-router";

import makeServerClient from "~/core/lib/supa-client.server";
import { deleteAccessToken } from "~/features/settings/mutations";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const formData = await request.formData();
    const platform = formData.get("platform") as string;

    if (!platform) {
      return new Response(JSON.stringify({ error: "Platform is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 현재 사용자 가져오기
    const [client] = makeServerClient(request);
    const {
      data: { user },
    } = await client.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 플랫폼별 연결 해제 처리
    if (platform === "threads") {
      await deleteAccessToken(client, {
        userId: user.id,
        targetType: "thread",
      });
    } else {
      return new Response(JSON.stringify({ error: "Unsupported platform" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, platform }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error disconnecting platform:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
