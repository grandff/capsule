import type { LoaderFunctionArgs } from "react-router";

import { promptService } from "../lib/prompt-service";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const text = url.searchParams.get("text");

  try {
    // default
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

export const getPerplexityPrompt = () => {
  const prompt = `
  내가 관심 있어 하는 키워드는 "{{keyword-list}}"이야.  
  이 키워드를 기준으로 웹사이트(뉴스, 블로그, 커뮤니티 등)에 "{{date-range}}" 사이에 작성된 글에서 자주 함께 언급된 트렌드 키워드들을 분석해줘.

- 언급량을 기준으로 키워드 순위를 매겨줘.
- 총 10개에서 20개 사이의 키워드를 선정해줘.
- 각 키워드마다 해당 키워드가 어떤 문맥에서 많이 언급되었는지 설명해줘 (ex. 가족 여행지 추천, 키즈카페 트렌드 등).
- 응답은 반드시 아래 JSON 포맷을 따르도록 해줘. 배열 형식과 JSON 문법을 정확하게 맞춰줘.


{
  "data": [
    {
      "keyword": "",
      "rank": 1,
      "description": ""
    },
    ...
  ]
}
  `;

  return prompt;
};

export const getAnalysisPrompt = () => {
  const prompt = `
  아래는 사용자가 최근 작성한 SNS 쓰레드 글 3개입니다.

당신은 사용자의 표현 습관과 관심사를 부드럽게 짚어주는 친근한 콘텐츠 어시스턴트입니다.

이 데이터를 참고해 아래 조건에 맞는 한 문단을 생성해주세요:

- 말투는 블로그나 SNS에서 친구한테 툭 던지듯 자연스럽고 친근하게 써주세요.
- '사용자'라는 말은 쓰지 말고, 3인칭 또는 암묵적 주어로 표현해주세요. (예: “요즘은 ~에 빠져 있는 느낌이다”, “계속 ~ 얘기가 나온다” 등)
- 전체적인 관심사 흐름, 반복되는 감정/표현 스타일 등을 **간단히 한두 문장으로 감성적으로 짚어주세요.**
- **정보 요약은 피하고**, 되도록 감정, 반복된 분위기, 관심 흐름 중심으로 써주세요.
- 추천 주제는 “~도 써보면 재밌겠다”, “이번엔 ~ 얘기를 해봐도 좋을 듯”처럼 자연스럽게 제안해주세요.
- 만약 아래와 같이 사용자 관심 키워드가 주어졌다면, 추천 주제에서 이를 참고해 활용해주세요.  
  (예시) 사용자 관심 키워드: ["수영장", "야외요리", "여름간식"]
- 전체 문장은 2~3문장 이내, 마침표로 끝나는 자연스러운 단락으로 작성해주세요.
- 기계적인 정리, 반복적인 문장 구조, 노골적인 분석 문장은 피해주세요.
- 출력 문장은 그대로 데이터베이스에 저장 가능한 형식이어야 합니다.

아래는 사용자의 최근 글입니다:

---
글 1: {{text1}}  
글 2: {{text2}}  
글 3: {{text3}}
---
사용자 관심 키워드: "{{keyword-list}}"
---

  `;

  return prompt;
};
