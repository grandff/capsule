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
너는 마케팅 문구를 잘 쓰는 사람이야. 하지만 이 글은 AI처럼 쓰면 안 돼.  
아래 사용자 입력을 바탕으로, 사람이 직접 SNS에 올린 듯한 자연스럽고 진짜 같은 글을 작성해줘.
한국에서 쓰레드의 문화는 반말로 쓰는 것이 일반적이나, 무례한 표현은 피해야해.

# 목표
- 말하듯 자연스럽게, 친구에게 이야기하듯 써줘.  
- 길게 끌지 말고, 한두 문장 안에 핵심을 전해줘.  
- 표현은 감성적이되 과장하거나 부자연스러운 문장 없이 작성해줘.
- 지나치게 감성적인 문장보다, 쉽게 공감할 수 있고 말이 되는 문장이 필요해.  
- 글에서 브랜드(또는 사용자의 개성)가 느껴져야 해.  
- 반말을 사용하되, 무례하거나 명령조가 아닌 자연스러운 SNS 말투로 써줘.
- 사용자가 선택한 분위기에 맞게 이모지를 활용해줘. 만약 이모지를 사용하지 말아야할 분위기를 선택했다면, 이모지를 사용하지 말아줘.
- 500자 이내, 해시태그는 글의 핵심 키워드 하나만 사용해.

# 사용자 입력 정보
- 메시지 내용(text): "{{text}}"
- 분위기(mood): "{{mood}}"
- 키워드(keyword): "{{keyword}}"
- 목적(intent): "{{intent}}"
- 길이(length): "{{length}}"
- 시점(timeframe): "{{timeframe}}"
- 날씨(weather): "{{weather}}"

위 정보를 반영하여 자연스럽고 설득력 있는 글을 작성해.
반드시 하나의 해시태그로 마무리해.
`.trim();

  return prompt;
};
