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
- 500자 이내로 작성하고, 해시태그는 필요하다면 하나의 해시태그만 사용해야하고, 필요하지 않다면 사용하지 말아줘.

# 사용자 입력 정보
- 메시지 내용(text): "{{text}}"
- 분위기(mood): "{{mood}}"
- 키워드(keyword): "{{keyword}}"
- 목적(intent): "{{intent}}"
- 길이(length): "{{length}}"
- 시점(timeframe): "{{timeframe}}"
- 날씨(weather): "{{weather}}"

위 정보를 반영하여 자연스럽고 설득력 있는 글을 작성해.

`.trim();

  return prompt;
};

export const getPerplexityPrompt = () => {
  const prompt = `
  다음 조건을 참고해, 사용자에게 보여줄 수 있는 '최근 트렌드' 데이터를 만들어줘.

- 날짜: "{{date-range}}"까지
- 검색 키워드: "{{keyword-list}}"
- 출처: 블로그, 커뮤니티, 지역 카페, 사용자 후기 중심 콘텐츠 (뉴스는 정보 참조만)

분석 방식:
- 단순 키워드 빈도 나열이 아니라, **의미 있는 흐름/문맥/관심 테마**를 중심으로 트렌드를 추출할 것
- 유사 키워드는 하나의 트렌드로 묶어서 해석 (예: '물놀이', '계곡', '수영장' → '여름형 가족 물놀이터')
- 너무 일반적이거나 포괄적인 키워드만 나열하지 말고, **특정한 행동, 장소 유형, 경향** 중심으로 정리
- 각 트렌드는 실제 사용자의 후기/추천에서 나타나는 감정, 니즈, 상황 등을 바탕으로 서술

출력 형식은 반드시 아래와 같은 JSON 배열로 반환:
{
  "data": [
    {
      "keyword": "트렌드 제목을 간결하게 작성",
      "rank" : "순위. 반드시 정수로 작성",
      "description": "이 트렌드가 최근 어떤 맥락에서 많이 언급되는지, 누구에게 인기 있는지, 어떤 흐름 속에 있는지를 설명. 문장 말투는 자연스럽게 정보 전달하듯 쓸 것."
    }
  ]
}
  `;

  return prompt;
};

export const getAnalysisPrompt = () => {
  const prompt = `
  다음은 사용자가 최근 작성한 SNS 쓰레드 글 3개입니다.

당신은 글쓰기 방향을 자연스럽게 제안해주는 콘텐츠 어시스턴트입니다.

이 데이터를 참고하여, 아래 조건을 만족하는 한 문단을 생성해주세요:

- 말투는 SNS나 블로그에서 친구에게 말하듯 **친근하고 자연스럽게** 써주세요. 부담 없이 툭 던지는 톤이면 좋습니다.
- '사용자'라는 단어는 절대 사용하지 말고, **3인칭 또는 암묵적 주어**로 표현해주세요.
- 최근 글에서 반복된 감정, 관심 주제, 어휘가 있다면 **1문장 정도로 부드럽게 언급**해 주세요.
- **정보 요약은 최소화**하고, 감정 흐름이나 분위기 중심으로 흐르듯 작성해 주세요.
- **문단의 마지막에**, 오늘 써볼 만한 글 주제를 **자연스럽게 제안**해 주세요. 
  (예: '~도 괜찮을 것 같다', '~한 얘기를 써보는 것도 재밌겠다', '~으로 이어가보는 건 어때' 등)
- 아래 주어지는 관심 키워드가 있다면, 제안 주제를 생각할 때 **반영해 주세요.**
- 전체 문장은 2~3문장 이내의 단락으로 구성되어야 하며, **마침표로 끝나는 자연스러운 문장**이어야 합니다.
- 분석적인 문체, 정리된 문장 구조, 인위적인 감성 표현은 피해주세요.
- 결과 문장은 그대로 데이터베이스에 저장 가능한 형태여야 합니다.

아래는 최근 사용자 글입니다:


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

export const getFeedbackPrompt = () => {
  const prompt = `
  다음은 사용자가 피드백을 요청한 글입니다.
  {{text}}

  사용자의 요구사항은 아래와 같습니다.  
  - 수정 요구사항 : {{needs}}
  - 기타 요구사항 : {{etc}}

  위 요구사항을 참고하고 아래의 목표를 지키면서 글을 수정해주세요.

  # 목표
  - 말하듯 자연스럽게, 친구에게 이야기하듯 써줘.  
  - 길게 끌지 말고, 한두 문장 안에 핵심을 전해줘.    
  - 반말을 사용하되, 무례하거나 명령조가 아닌 자연스러운 SNS 말투로 써줘.
  - 500자 이내로 작성하고, 해시태그는 필요하다면 하나의 해시태그만 사용해야하고, 필요하지 않다면 사용하지 말아줘.
  `;

  return prompt;
};

export const getFeedbackSystemPrompt = () => {
  const prompt = `
  당신은 사용자가 원하는 글을 작성해주는 유명한 카피라이터 이자 작가입니다. 
  사용자는 이전에 당신이 작성한 글을 보고 피드백을 요청합니다.
  당신은 사용자의 피드백을 참고하여 글을 수정해주세요.  
  `;

  return prompt;
};
