export interface ValidationConfig {
  maxLength: number;
  minLengthForMood: number;
  maxMoods: number;
}

export const DEFAULT_VALIDATION_CONFIG: ValidationConfig = {
  maxLength: 100,
  minLengthForMood: 10,
  maxMoods: 3,
};

export function validateTextLength(text: string, maxLength: number): boolean {
  return text.length <= maxLength;
}

export function validateMinLength(text: string, minLength: number): boolean {
  return text.length >= minLength;
}

export function validateMoodSelection(
  selectedMoods: string[],
  maxMoods: number,
): { isValid: boolean; errorMessage?: string } {
  if (selectedMoods.length > maxMoods) {
    return {
      isValid: false,
      errorMessage: `분위기는 최대 ${maxMoods}개까지 선택 가능합니다.`,
    };
  }
  return { isValid: true };
}

export function validateKeyword(
  keyword: string,
  existingKeywords: string[],
): {
  isValid: boolean;
  errorMessage?: string;
} {
  if (!keyword.trim()) {
    return { isValid: false, errorMessage: "키워드를 입력해주세요." };
  }

  if (existingKeywords.includes(keyword.trim())) {
    return { isValid: false, errorMessage: "이미 추가된 키워드입니다." };
  }

  return { isValid: true };
}

export function getRequiredSelectionsMessage(
  selectedMoods: string[],
  keywords: string[],
  selectedIntents: string[],
): string | null {
  const missingItems = [];

  if (selectedMoods.length === 0) missingItems.push("분위기");
  if (keywords.length === 0) missingItems.push("핵심 키워드");
  if (selectedIntents.length === 0) missingItems.push("목적");

  if (missingItems.length === 0) return null;

  return `다음 항목을 선택해주세요: ${missingItems.join(", ")}`;
}

export function canCreatePromotion(
  selectedMoods: string[],
  keywords: string[],
  selectedIntents: string[],
): boolean {
  return (
    selectedMoods.length > 0 &&
    keywords.length > 0 &&
    selectedIntents.length > 0
  );
}
