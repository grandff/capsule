import { useState } from "react";

import { INTENT_OPTIONS, MOOD_OPTIONS } from "~/constants";
import { Badge } from "~/core/components/ui/badge";
import { Button } from "~/core/components/ui/button";
import { Input } from "~/core/components/ui/input";

import {
  DEFAULT_VALIDATION_CONFIG,
  validateMoodSelection,
} from "../utils/validation-utils";

interface StyleSelectionSectionProps {
  selectedMoods: string[];
  onMoodToggle: (mood: string) => void;
  selectedIntents: string[];
  onIntentSelect: (intent: string) => void;
  keywords: string[];
  onKeywordAdd: (keyword: string) => void;
  onKeywordRemove: (keyword: string) => void;
  maxSelectionError: string;
  validationConfig?: typeof DEFAULT_VALIDATION_CONFIG;
}

export function StyleSelectionSection({
  selectedMoods,
  onMoodToggle,
  selectedIntents,
  onIntentSelect,
  keywords,
  onKeywordAdd,
  onKeywordRemove,
  maxSelectionError,
  validationConfig = DEFAULT_VALIDATION_CONFIG,
}: StyleSelectionSectionProps) {
  const [showAllMoods, setShowAllMoods] = useState(false);
  const [keywordInput, setKeywordInput] = useState("");
  const [writeMode, setWriteMode] = useState<"good" | "search">("good");

  const handleKeywordAdd = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      onKeywordAdd(keywordInput.trim());
      setKeywordInput("");
    }
  };

  const handleKeywordKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleKeywordAdd();
    }
  };

  const handleMoodToggle = (mood: string) => {
    const validation = validateMoodSelection(
      selectedMoods,
      validationConfig.maxMoods,
    );
    if (!validation.isValid && !selectedMoods.includes(mood)) {
      // 에러 처리는 부모 컴포넌트에서 처리
      return;
    }
    onMoodToggle(mood);
  };

  return (
    <div className="space-y-8">
      {/* 생성 방식 선택 UI */}
      <div className="mb-8 flex flex-col items-center gap-4">
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:gap-4">
          <Button
            variant={writeMode === "good" ? "default" : "outline"}
            onClick={() => setWriteMode("good")}
            className={`w-full px-6 py-3 text-base font-medium sm:w-auto ${
              writeMode === "good"
                ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            좋은 글을 쓰고 싶어요
          </Button>
          <Button
            variant="outline"
            onClick={() => {}} // 빈 함수로 이벤트 없음
            className="w-full cursor-not-allowed border-gray-300 px-6 py-3 text-base font-medium text-gray-500 opacity-50 sm:w-auto dark:border-gray-600 dark:text-gray-400"
          >
            검색이 필요해요
          </Button>
        </div>
        <p className="text-sm text-red-500 dark:text-red-400">
          검색 기능은 곧 만나볼 수 있어요! 👋
        </p>
      </div>

      {/* 목적 선택 */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            글의 목적을 선택해주세요
          </h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {INTENT_OPTIONS.map((intent) => (
            <Badge
              key={intent}
              variant={selectedIntents.includes(intent) ? "default" : "outline"}
              className={`cursor-pointer px-4 py-2 text-sm font-medium transition-all ${selectedIntents.includes(intent) ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600" : "hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"}`}
              onClick={() => onIntentSelect(intent)}
            >
              {intent}
            </Badge>
          ))}
        </div>
      </div>

      {/* 분위기 선택 */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            어떤 분위기로 작성할까요?
          </h3>
          {selectedMoods.length < validationConfig.maxMoods ? (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {validationConfig.maxMoods - selectedMoods.length}개 더 선택
              가능해요!
            </span>
          ) : (
            <span className="text-sm text-red-500 dark:text-red-400">
              모두 선택했어요!
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          {(showAllMoods ? MOOD_OPTIONS : MOOD_OPTIONS.slice(0, 5)).map(
            (mood) => (
              <Badge
                key={mood}
                variant={selectedMoods.includes(mood) ? "default" : "outline"}
                className={`cursor-pointer px-4 py-2 text-sm font-medium transition-all ${
                  selectedMoods.includes(mood)
                    ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    : "hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
                onClick={() => handleMoodToggle(mood)}
              >
                {mood}
              </Badge>
            ),
          )}
        </div>
        {MOOD_OPTIONS.length > 5 && (
          <div className="mt-3">
            <Button
              onClick={() => setShowAllMoods(!showAllMoods)}
              variant="outline"
              size="sm"
              className="border-gray-300 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {showAllMoods
                ? "접기"
                : `더 보기 (${MOOD_OPTIONS.length - 5}개 더)`}
            </Button>
          </div>
        )}
      </div>

      {/* 최대 선택 에러 메시지 */}
      {maxSelectionError && (
        <div className="rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
          <p className="text-sm text-red-600 dark:text-red-400">
            ⚠️ {maxSelectionError}
          </p>
        </div>
      )}

      {/* 키워드 입력 */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          꼭 들어갔으면 하는 단어가 있나요?
        </h3>
        <div className="mb-4 flex gap-3">
          <Input
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyPress={handleKeywordKeyPress}
            placeholder="키워드를 입력하고 Enter를 누르세요"
            className="flex-1 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400"
          />
          <Button
            onClick={handleKeywordAdd}
            disabled={!keywordInput.trim()}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            추가
          </Button>
        </div>

        {/* 입력된 키워드들 */}
        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword) => (
              <Badge
                key={keyword}
                variant="secondary"
                className="cursor-pointer bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
                onClick={() => onKeywordRemove(keyword)}
              >
                {keyword} ×
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
