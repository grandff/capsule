import type { ActionFunctionArgs } from "react-router";

import { requireAuthentication } from "~/core/lib/guards.server";
import makeServerClient from "~/core/lib/supa-client.server";
import { getThreadsAccessToken } from "~/features/settings/queries";

export async function action({ request }: ActionFunctionArgs) {
  const [supabase, headers] = makeServerClient(request);
  await requireAuthentication(supabase);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "사용자 인증이 필요합니다.",
      }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  try {
    console.log("check-token: getThreadsAccessToken 호출");
    const { accessToken, expiresAt } = await getThreadsAccessToken(
      supabase,
      user.id,
    );

    if (!accessToken) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Threads 계정이 연결되지 않았습니다.",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // 토큰 만료 확인
    if (expiresAt && new Date() > new Date(expiresAt)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Threads 토큰이 만료되었습니다. 다시 연결해주세요.",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("토큰 확인 중 오류:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "토큰 확인 중 오류가 발생했습니다.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
