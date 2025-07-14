export interface PromotionData {
  text: string;
  selectedMoods: string[];
  keywords: string[];
  selectedIntents: string[];
  selectedLength: string;
  selectedTimeframe: string;
  selectedWeather: string;
}

export interface PromotionResult {
  content: string;
  originalText: string;
  moods: string[];
  keywords: string[];
  intents: string[];
  length: string;
  timeframe: string;
  weather: string;
}

export async function createPromotion(
  data: PromotionData,
): Promise<PromotionResult> {
  // 1. 프롬프트 가져오기
  const prompts = await fetch("/api/write/prompts");
  const promptsData = await prompts.json();

  // 2. 생성 요청
  const formData = new FormData();
  formData.append("prompt", promptsData.prompts);
  formData.append("text", data.text);
  formData.append("mood", data.selectedMoods.join(","));
  formData.append("keyword", data.keywords.join(","));
  formData.append("intent", data.selectedIntents[0] || "미설정");
  formData.append(
    "length",
    data.selectedLength.length > 0 ? data.selectedLength : "미설정",
  );
  formData.append(
    "timeframe",
    data.selectedTimeframe.length > 0 ? data.selectedTimeframe : "미설정",
  );
  formData.append(
    "weather",
    data.selectedWeather.length > 0 ? data.selectedWeather : "미설정",
  );

  const response = await fetch("/api/chatgpt/create-gpt-idea", {
    method: "POST",
    body: formData,
  });

  const { completion } = await response.json();

  if (!completion) {
    throw new Error("GPT 응답을 받지 못했습니다.");
  }

  // 결과 데이터 준비
  return {
    content: completion,
    originalText: data.text,
    moods: data.selectedMoods,
    keywords: data.keywords,
    intents: data.selectedIntents,
    length: data.selectedLength,
    timeframe: data.selectedTimeframe,
    weather: data.selectedWeather,
  };
}

export function simulateProgress(
  onProgressUpdate: (progress: number) => void,
  onComplete: () => void,
): () => void {
  let progress = 0;
  const interval = setInterval(() => {
    progress += 20;
    onProgressUpdate(progress);

    if (progress >= 100) {
      clearInterval(interval);
      onComplete();
    }
  }, 1000);

  // cleanup 함수 반환
  return () => clearInterval(interval);
}
