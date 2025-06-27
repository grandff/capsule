import type {
  PromptRequest,
  PromptResponse,
  PromptTemplate,
  PromptType,
} from "../schema";

// 프롬프트 변수 치환 함수
function replaceVariables(
  template: string,
  variables: Record<string, string>,
): string {
  let result = template;

  // {{variable}} 형태의 변수를 실제 값으로 치환
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    result = result.replace(regex, value);
  });

  return result;
}

// 기본 프롬프트 템플릿들
const DEFAULT_PROMPTS: PromptTemplate[] = [
  {
    id: "social-media-post-basic",
    name: "소셜미디어 기본 포스트",
    description: "일반적인 소셜미디어 포스트를 생성하는 기본 프롬프트",
    type: "SOCIAL_MEDIA_POST",
    category: "BASIC",
    template: `다음 조건에 맞는 소셜미디어 포스트를 작성해주세요:

사용자 입력: {{userText}}

요구사항:
- 분위기: {{moods}}
- 산업군: {{industries}}
- 톤: {{tones}}
- 핵심 키워드: {{keywords}}
{{#if intents}}- 의도: {{intents}}{{/if}}
{{#if length}}- 글 길이: {{length}}{{/if}}
{{#if timeframe}}- 시점/상황: {{timeframe}}{{/if}}
{{#if weather}}- 날씨: {{weather}}{{/if}}

다음 형식으로 작성해주세요:
1. 매력적인 제목 (해시태그 포함)
2. 본문 내용 (감정적이고 공감되는 내용)
3. 적절한 이모지 사용
4. 관련 해시태그 3-5개

포스트는 {{moods}}한 분위기로, {{tones}}한 톤을 유지하며, {{industries}} 분야에 적합하게 작성해주세요.`,
    variables: [
      {
        name: "userText",
        description: "사용자가 입력한 텍스트",
        required: true,
      },
      { name: "moods", description: "선택된 분위기들", required: true },
      { name: "industries", description: "선택된 산업군들", required: true },
      { name: "tones", description: "선택된 톤들", required: true },
      { name: "keywords", description: "핵심 키워드들", required: true },
      { name: "intents", description: "의도", required: false },
      { name: "length", description: "글 길이", required: false },
      { name: "timeframe", description: "시점/상황", required: false },
      { name: "weather", description: "날씨", required: false },
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "product-promotion-advanced",
    name: "제품 홍보 고급 프롬프트",
    description: "제품 홍보에 특화된 고급 프롬프트",
    type: "PRODUCT_PROMOTION",
    category: "ADVANCED",
    template: `제품 홍보를 위한 전문적인 소셜미디어 포스트를 작성해주세요:

사용자 입력: {{userText}}

마케팅 요구사항:
- 분위기: {{moods}}
- 산업군: {{industries}}
- 톤: {{tones}}
- 핵심 키워드: {{keywords}}
{{#if intents}}- 의도: {{intents}}{{/if}}

제품 홍보 전략:
1. 고객 페인포인트 인식
2. 제품의 핵심 가치 제안
3. 구체적인 혜택 설명
4. 행동 유도 (CTA)

포스트 구조:
- 매력적인 헤드라인
- 문제 상황 제시
- 해결책으로서의 제품 소개
- 구체적인 혜택 나열
- 행동 유도 문구
- 관련 해시태그

{{moods}}한 분위기와 {{tones}}한 톤을 유지하며, {{industries}} 분야의 전문성을 드러내주세요.`,
    variables: [
      {
        name: "userText",
        description: "사용자가 입력한 텍스트",
        required: true,
      },
      { name: "moods", description: "선택된 분위기들", required: true },
      { name: "industries", description: "선택된 산업군들", required: true },
      { name: "tones", description: "선택된 톤들", required: true },
      { name: "keywords", description: "핵심 키워드들", required: true },
      { name: "intents", description: "의도", required: false },
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "daily-share-casual",
    name: "일상 공유 캐주얼",
    description: "일상적인 내용을 친근하게 공유하는 프롬프트",
    type: "DAILY_SHARE",
    category: "BASIC",
    template: `일상적인 경험을 친근하고 공감되는 소셜미디어 포스트로 작성해주세요:

사용자 입력: {{userText}}

스타일 요구사항:
- 분위기: {{moods}}
- 산업군: {{industries}}
- 톤: {{tones}}
- 핵심 키워드: {{keywords}}
{{#if weather}}- 날씨: {{weather}}{{/if}}

일상 공유 포스트 특징:
1. 개인적 경험을 공감할 수 있는 내용으로 변환
2. 따뜻하고 친근한 어조
3. 독자와의 연결감 형성
4. 적절한 이모지 사용으로 감정 표현
5. 일상의 소소한 깨달음이나 재미있는 순간 강조

{{moods}}한 분위기로, {{tones}}한 톤을 유지하며, {{industries}} 분야와 연관된 인사이트를 담아주세요.`,
    variables: [
      {
        name: "userText",
        description: "사용자가 입력한 텍스트",
        required: true,
      },
      { name: "moods", description: "선택된 분위기들", required: true },
      { name: "industries", description: "선택된 산업군들", required: true },
      { name: "tones", description: "선택된 톤들", required: true },
      { name: "keywords", description: "핵심 키워드들", required: true },
      { name: "weather", description: "날씨", required: false },
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

class PromptService {
  private prompts: Map<string, PromptTemplate> = new Map();

  constructor() {
    // 기본 프롬프트들을 로드
    DEFAULT_PROMPTS.forEach((prompt) => {
      this.prompts.set(prompt.id, prompt);
    });
  }

  // 모든 활성 프롬프트 가져오기
  getAllActivePrompts(): PromptTemplate[] {
    return Array.from(this.prompts.values()).filter(
      (prompt) => prompt.isActive,
    );
  }

  // 타입별 프롬프트 가져오기
  getPromptsByType(type: PromptType): PromptTemplate[] {
    return this.getAllActivePrompts().filter((prompt) => prompt.type === type);
  }

  // 카테고리별 프롬프트 가져오기
  getPromptsByCategory(category: string): PromptTemplate[] {
    return this.getAllActivePrompts().filter(
      (prompt) => prompt.category === category,
    );
  }

  // 특정 프롬프트 가져오기
  getPromptById(id: string): PromptTemplate | undefined {
    return this.prompts.get(id);
  }

  // 프롬프트 추가
  addPrompt(prompt: PromptTemplate): void {
    this.prompts.set(prompt.id, prompt);
  }

  // 프롬프트 업데이트
  updatePrompt(id: string, updates: Partial<PromptTemplate>): boolean {
    const prompt = this.prompts.get(id);
    if (!prompt) return false;

    const updatedPrompt = {
      ...prompt,
      ...updates,
      updatedAt: new Date(),
    };

    this.prompts.set(id, updatedPrompt);
    return true;
  }

  // 프롬프트 삭제 (비활성화)
  deactivatePrompt(id: string): boolean {
    return this.updatePrompt(id, { isActive: false });
  }

  // 프롬프트 템플릿에서 변수 치환
  processPromptTemplate(
    promptId: string,
    variables: Record<string, string>,
  ): string | null {
    const prompt = this.getPromptById(promptId);
    if (!prompt) return null;

    return replaceVariables(prompt.template, variables);
  }

  // ChatGPT API 호출을 위한 프롬프트 생성
  async generateContent(request: PromptRequest): Promise<PromptResponse> {
    try {
      const startTime = Date.now();

      // 프롬프트 템플릿 처리
      const processedPrompt = this.processPromptTemplate(
        request.promptId,
        request.variables,
      );

      if (!processedPrompt) {
        return {
          success: false,
          content: "",
          promptUsed: "",
          error: "프롬프트를 찾을 수 없습니다.",
        };
      }

      // ChatGPT API 호출 (실제 구현 필요)
      const response = await this.callChatGPTAPI(processedPrompt);

      const processingTime = Date.now() - startTime;

      return {
        success: true,
        content: response.content,
        promptUsed: processedPrompt,
        metadata: {
          model: "gpt-4",
          tokens: response.tokens || 0,
          processingTime,
        },
      };
    } catch (error) {
      return {
        success: false,
        content: "",
        promptUsed: "",
        error:
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다.",
      };
    }
  }

  // ChatGPT API 호출 (실제 구현 필요)
  private async callChatGPTAPI(
    prompt: string,
  ): Promise<{ content: string; tokens?: number }> {
    // TODO: 실제 ChatGPT API 호출 구현
    // 현재는 모의 응답 반환

    // 실제 구현 시에는 다음과 같은 구조로 구현:
    /*
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: '당신은 전문적인 소셜미디어 콘텐츠 작성자입니다.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      tokens: data.usage.total_tokens,
    };
    */

    // 모의 응답
    await new Promise((resolve) => setTimeout(resolve, 2000)); // 2초 대기

    return {
      content: `[생성된 홍보글 내용]\n\n사용자 입력: "${prompt.split("사용자 입력:")[1]?.split("\n")[0] || "내용 없음"}"\n\n이 내용을 바탕으로 ${Math.random() > 0.5 ? "매력적이고" : "전문적인"} 소셜미디어 포스트를 생성했습니다. 실제 ChatGPT API 연동 시에는 더 풍부하고 맥락에 맞는 내용이 생성될 것입니다.`,
      tokens: Math.floor(Math.random() * 500) + 200,
    };
  }

  // 사용자 설정에 맞는 최적의 프롬프트 추천
  recommendPrompt(settings: {
    moods: string[];
    industries: string[];
    tones: string[];
    intents?: string[];
  }): PromptTemplate | null {
    const activePrompts = this.getAllActivePrompts();

    // 의도에 따른 프롬프트 타입 매핑
    const intentToType: Record<string, PromptType> = {
      제품홍보: "PRODUCT_PROMOTION",
      "이벤트 안내": "EVENT_ANNOUNCEMENT",
      "일상 공유": "DAILY_SHARE",
      "후기/리뷰": "REVIEW",
      브랜딩: "BRANDING",
      고객유치: "CUSTOMER_ACQUISITION",
      "뉴스 공유": "NEWS_SHARE",
      "인사이트 전달": "INSIGHT_DELIVERY",
      "서비스 소개": "SERVICE_INTRO",
    };

    // 의도가 있으면 해당 타입의 프롬프트 우선 선택
    if (settings.intents && settings.intents.length > 0) {
      const primaryIntent = settings.intents[0];
      const recommendedType = intentToType[primaryIntent];

      if (recommendedType) {
        const typePrompts = activePrompts.filter(
          (p) => p.type === recommendedType,
        );
        if (typePrompts.length > 0) {
          return typePrompts[0]; // 첫 번째 매칭되는 프롬프트 반환
        }
      }
    }

    // 기본적으로 소셜미디어 포스트 프롬프트 반환
    const socialMediaPrompts = activePrompts.filter(
      (p) => p.type === "SOCIAL_MEDIA_POST",
    );
    return socialMediaPrompts.length > 0 ? socialMediaPrompts[0] : null;
  }
}

// 싱글톤 인스턴스 생성
export const promptService = new PromptService();
