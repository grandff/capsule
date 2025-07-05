import type { LoaderFunctionArgs } from "react-router";

import { promptService } from "../lib/prompt-service";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const category = url.searchParams.get("category");

  try {
    // FIXME 다양한 프롬프트 분기점 만들어야함
    let prompts = getDefaultPrompt();

    return new Response(
      JSON.stringify({
        success: true,
        prompts,
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

const getDefaultPrompt = () => {
  const prompt = `
당신은 마케팅 카피라이팅 전문가입니다. 아래 사용자 입력을 바탕으로 브랜드 또는 여행지, 혹은 다양한 목적에 맞는 글을 작성하세요.
한국에서 쓰레드의 문화는 반말로 쓰는 것이 일반적이나, 무례한 표현은 피하세요.

목표:
- 사용자의 목적(intent)에 맞게 글을 작성하세요. (예: 브랜드 홍보, 여행지 소개 등)
- 임팩트 있는 문장으로 사람의 시선을 끌어야 합니다.
- 지나치게 감성적이거나 장황한 설명은 피하고, 직관적이고 설득력 있게 써주세요.
- 해시태그는 글의 핵심 키워드 하나만 사용하세요.
- 500자 이내로 작성하세요.

# 사용자 입력 정보
- 메시지 내용(text): "{{text}}"
- 분위기(mood): "{{mood}}"
- 톤(tone): "{{tone}}"
- 키워드(keyword): "{{keyword}}"
- 목적(intent): "{{intent}}"
- 길이(length): "{{length}}"
- 시점(timeframe): "{{timeframe}}"
- 날씨(weather): "{{weather}}"

위 정보를 반영하여 자연스럽고 설득력 있는 글을 작성하세요.
반드시 하나의 해시태그로 마무리하세요.
`.trim();

  return prompt;
};
