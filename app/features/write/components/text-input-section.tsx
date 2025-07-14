import { useEffect, useRef } from "react";

import { Button } from "~/core/components/ui/button";
import { Textarea } from "~/core/components/ui/textarea";

import {
  DEFAULT_VALIDATION_CONFIG,
  validateTextLength,
} from "../utils/validation-utils";

interface TextInputSectionProps {
  text: string;
  onTextChange: (text: string) => void;
  isTextReadonly: boolean;
  moodButtonText: string;
  onMoodButtonClick: () => void;
  validationConfig?: typeof DEFAULT_VALIDATION_CONFIG;
}

export function TextInputSection({
  text,
  onTextChange,
  isTextReadonly,
  moodButtonText,
  onMoodButtonClick,
  validationConfig = DEFAULT_VALIDATION_CONFIG,
}: TextInputSectionProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // 최초 렌더링 시 textarea에 포커스
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (validateTextLength(value, validationConfig.maxLength)) {
      onTextChange(value);
    }
  };

  const canProceed = text.length >= validationConfig.minLengthForMood;

  return (
    <div className="flex flex-1 items-start justify-center p-6">
      <div className="w-full max-w-3xl">
        {/* 텍스트 에어리어 영역 */}
        <div className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-gray-200/50 dark:bg-gray-800 dark:ring-gray-700/50">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              어떤 이야기를 들려주실 건가요?
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              최소 {validationConfig.minLengthForMood}자 이상 작성해주세요
            </p>
          </div>

          <Textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            placeholder="오늘 있었던 일, 느낀 점, 또는 전하고 싶은 메시지를 자유롭게 작성해보세요!"
            className="min-h-[120px] resize-none border-0 bg-transparent text-lg leading-relaxed focus:ring-0 focus:outline-none dark:text-white dark:placeholder:text-gray-400"
            maxLength={validationConfig.maxLength}
            readOnly={isTextReadonly}
          />

          {/* 글자수 표시 */}
          <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {canProceed ? (
                <span className="text-green-600 dark:text-green-400">
                  ✓ 이제 홍보글 설정하기 버튼을 눌러보세요!
                </span>
              ) : (
                <span className="text-red-500 dark:text-red-400">
                  {validationConfig.minLengthForMood - text.length}글자 더
                  작성해주세요!
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {text.length}/{validationConfig.maxLength}
            </div>
          </div>
        </div>

        {/* 분위기 선택 버튼 */}
        <div className="mt-6 flex justify-center">
          <Button
            onClick={onMoodButtonClick}
            disabled={!canProceed}
            className={`px-8 py-5 text-lg font-medium transition-all duration-200 ${
              canProceed
                ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                : "cursor-not-allowed bg-gray-300 text-gray-500 dark:bg-gray-600 dark:text-gray-400"
            }`}
          >
            {moodButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
}
