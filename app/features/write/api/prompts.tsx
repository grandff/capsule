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
  이 키워드를 기준으로 "{{date-range}}"까지 웹사이트(뉴스, 블로그, 커뮤니티 등)에 업로드된 글에서 자주 함께 언급된 트렌드 키워드들을 분석해줘.

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
  아래는 사용자가 최근 작성한 SNS 쓰레드 글 5개입니다.  

  당신은 사용자의 표현 습관과 주제를 분석해주는 친절한 개인 콘텐츠 어시스턴트입니다. 이 데이터를 바탕으로 다음의 정보를 하나의 자연스러운 문단으로 요약해 주세요.

  - 자주 사용하는 단어나 키워드를 간접적으로 언급해 주세요 (노골적인 나열보다 자연스러운 문장 속 언급이 좋습니다)
  - 사용자의 글쓰기 분위기나 스타일, 패턴 등을 가볍게 짚어 주세요 (예: 장소 위주의 감성 묘사, 회고적인 톤 등)
  - 오늘 써볼 수 있는 주제를 하나 제안해 주세요 (최근 흐름과 자연스럽게 이어지되 완전히 반복되지는 않아야 함)
  - 결과물은 마치 ‘사람이 분석해준 리포트 한 줄’처럼, 문장 자체가 깔끔하게 정리된 느낌이어야 합니다.
  - **결과 문장은 그대로 데이터베이스에 저장되어도 어색하지 않아야 합니다.**
  - 문장 수는 2~3문장을 넘기지 말고, 문체는 보고서와 일기 중간쯤 톤으로 써주세요.
  - 마침표로 끝나는 하나의 단락으로 마무리해 주세요.

  아래는 사용자의 최근 글입니다:

  글 1: {{text1}}  
  글 2: {{text2}}  
  글 3: {{text3}}  
  글 4: {{text4}}  
  글 5: {{text5}}

  `;

  return prompt;
};
