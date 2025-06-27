import type { ActionFunctionArgs } from "react-router";

import type { PromptRequest } from "../schema";

import { promptService } from "../lib/prompt-service";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.json();

    // 요청 데이터 검증
    const promptRequest: PromptRequest = {
      promptId: body.promptId,
      variables: body.variables || {},
      userText: body.userText,
      settings: {
        moods: body.settings.moods || [],
        industries: body.settings.industries || [],
        tones: body.settings.tones || [],
        keywords: body.settings.keywords || [],
        intents: body.settings.intents || [],
        length: body.settings.length,
        timeframe: body.settings.timeframe,
        weather: body.settings.weather,
      },
    };

    // 필수 필드 검증
    if (!promptRequest.promptId) {
      return new Response(
        JSON.stringify({ error: "프롬프트 ID가 필요합니다." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    if (!promptRequest.userText || promptRequest.userText.length < 10) {
      return new Response(
        JSON.stringify({
          error: "사용자 텍스트는 최소 10자 이상이어야 합니다.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    if (promptRequest.settings.moods.length === 0) {
      return new Response(JSON.stringify({ error: "분위기를 선택해주세요." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (promptRequest.settings.industries.length === 0) {
      return new Response(JSON.stringify({ error: "산업군을 선택해주세요." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (promptRequest.settings.tones.length === 0) {
      return new Response(JSON.stringify({ error: "톤을 선택해주세요." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (promptRequest.settings.keywords.length === 0) {
      return new Response(JSON.stringify({ error: "키워드를 입력해주세요." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 프롬프트 서비스를 사용하여 콘텐츠 생성
    const response = await promptService.generateContent(promptRequest);

    if (!response.success) {
      return new Response(JSON.stringify({ error: response.error }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        content: response.content,
        promptUsed: response.promptUsed,
        metadata: response.metadata,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("콘텐츠 생성 중 오류:", error);
    return new Response(
      JSON.stringify({ error: "콘텐츠 생성 중 오류가 발생했습니다." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
