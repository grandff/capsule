import type { LoaderFunctionArgs } from "react-router";

import { promptService } from "../lib/prompt-service";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const category = url.searchParams.get("category");

  try {
    let prompts;

    if (type) {
      prompts = promptService.getPromptsByType(type as any);
    } else if (category) {
      prompts = promptService.getPromptsByCategory(category);
    } else {
      prompts = promptService.getAllActivePrompts();
    }

    return new Response(
      JSON.stringify({
        success: true,
        prompts,
        count: prompts.length,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("프롬프트 목록 조회 중 오류:", error);
    return new Response(
      JSON.stringify({
        error: "프롬프트 목록을 가져오는 중 오류가 발생했습니다.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
