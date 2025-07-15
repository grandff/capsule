import type { PromptTemplate } from "../schema";
import type { Route } from "./+types/write-today";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { AdvancedSettingsSection } from "../components/advanced-settings-section";
import { AIRecommendationSection } from "../components/ai-recommendation-section";
import { ProgressSection } from "../components/progress-section";
import { StyleSelectionSection } from "../components/style-selection-section";
import { TextInputSection } from "../components/text-input-section";
import { TokenAlertDialog } from "../components/token-alert-dialog";
import { createPromotion, simulateProgress } from "../utils/promotion-utils";
import { checkThreadsToken } from "../utils/token-utils";
import {
  DEFAULT_VALIDATION_CONFIG,
  canCreatePromotion,
} from "../utils/validation-utils";

export const meta: Route.MetaFunction = () => {
  return [{ title: `Today | ${import.meta.env.VITE_APP_NAME}` }];
};

export default function WriteToday() {
  const [text, setText] = useState("");
  const [showMoodSelection, setShowMoodSelection] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [selectedIntents, setSelectedIntents] = useState<string[]>([]);
  const [selectedLength, setSelectedLength] = useState<string>("");
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("");
  const [selectedWeather, setSelectedWeather] = useState<string>("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isCreatingPromotion, setIsCreatingPromotion] = useState(false);
  const [maxSelectionError, setMaxSelectionError] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const [isTextReadonly, setIsTextReadonly] = useState(false);
  const [moodButtonText, setMoodButtonText] = useState("홍보글 설정하기");
  const [showTokenAlert, setShowTokenAlert] = useState(false);
  const [tokenAlertMessage, setTokenAlertMessage] = useState("");
  const [aiRecommendation, setAiRecommendation] = useState<string>("");
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(false);

  const navigate = useNavigate();

  // 분위기 선택 핸들러
  const handleMoodToggle = (mood: string) => {
    if (selectedMoods.includes(mood)) {
      // 이미 선택된 항목이면 제거
      setSelectedMoods((prev) => prev.filter((m) => m !== mood));
      setMaxSelectionError(""); // 에러 메시지 제거
    } else {
      // 새로운 항목 선택 시 최대 개수 확인
      if (selectedMoods.length >= DEFAULT_VALIDATION_CONFIG.maxMoods) {
        setMaxSelectionError(
          `분위기는 최대 ${DEFAULT_VALIDATION_CONFIG.maxMoods}개까지 선택 가능합니다.`,
        );
        // 3초 후 에러 메시지 자동 제거
        setTimeout(() => setMaxSelectionError(""), 3000);
        return;
      }
      setSelectedMoods((prev) => [...prev, mood]);
      setMaxSelectionError(""); // 에러 메시지 제거
    }
  };

  // 글 길이 선택 핸들러
  const handleLengthSelect = (length: string) => {
    setSelectedLength(length);
  };

  // 시점 선택 핸들러
  const handleTimeframeSelect = (timeframe: string) => {
    setSelectedTimeframe(timeframe);
  };

  // 날씨 선택 핸들러
  const handleWeatherSelect = (weather: string) => {
    setSelectedWeather(weather);
  };

  // 키워드 추가 핸들러
  const handleKeywordAdd = (keyword: string) => {
    if (keyword.trim() && !keywords.includes(keyword.trim())) {
      setKeywords((prev) => [...prev, keyword.trim()]);
    }
  };

  // 키워드 삭제 핸들러
  const handleKeywordRemove = (keyword: string) => {
    setKeywords((prev) => prev.filter((k) => k !== keyword));
  };

  // 목적 선택 핸들러
  const handleIntentSelect = (intent: string) => {
    setSelectedIntents([intent]);
  };

  // AI 추천 내용 사용 핸들러
  const handleUseRecommendation = (recommendationText: string) => {
    setText(recommendationText);
  };

  // 홍보글 만들기 버튼 활성화 조건
  const canCreatePromotionValue = canCreatePromotion(
    selectedMoods,
    keywords,
    selectedIntents,
  );

  // 홍보글 만들기 핸들러
  const handleCreatePromotion = async () => {
    if (!canCreatePromotionValue) return;

    setIsCreatingPromotion(true);
    setProgress(0);

    try {
      const result = await createPromotion({
        text,
        selectedMoods,
        keywords,
        selectedIntents,
        selectedLength,
        selectedTimeframe,
        selectedWeather,
      });

      // 진행률 시뮬레이션
      const cleanup = simulateProgress(
        (newProgress) => setProgress(newProgress),
        () => {
          // 결과 데이터를 URL 파라미터로 전달
          const params = new URLSearchParams({
            result: JSON.stringify(result),
          });
          navigate(`/dashboard/write/result?${params.toString()}`);
        },
      );

      // cleanup 함수를 반환하여 필요시 중단할 수 있도록 함
      return cleanup;
    } catch (error) {
      console.error("홍보글 생성 중 오류:", error);
      setIsCreatingPromotion(false);
      setProgress(0);
    }
  };

  // 분위기 선택 버튼 핸들러
  const handleMoodButtonClick = async () => {
    if (!showMoodSelection) {
      // 토큰 확인
      const result = await checkThreadsToken();

      if (!result.success) {
        setTokenAlertMessage(result.message || "토큰 확인에 실패했습니다.");
        setShowTokenAlert(true);
        return;
      }

      // 토큰이 있으면 홍보글 설정 화면으로 이동
      setShowMoodSelection(true);
      setIsTextReadonly(true);
      setMoodButtonText("다시 작성하기");
    } else {
      setShowMoodSelection(false);
      setIsTextReadonly(false);
      setMoodButtonText("홍보글 설정하기");
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* 헤더 영역 */}
      <div className="">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <h1 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
            오늘의 이야기
          </h1>
          <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
            내 이야기를 매력적인 홍보글로 변환해보세요!
          </p>
        </div>
      </div>

      {/* AI 추천 영역 */}
      {/* <AIRecommendationSection
        recommendation={aiRecommendation}
        isLoading={isLoadingRecommendation}
        onUseRecommendation={handleUseRecommendation}
      /> */}

      {/* 텍스트 입력 영역 */}
      <TextInputSection
        text={text}
        onTextChange={setText}
        isTextReadonly={isTextReadonly}
        moodButtonText={moodButtonText}
        onMoodButtonClick={handleMoodButtonClick}
        validationConfig={DEFAULT_VALIDATION_CONFIG}
      />

      {/* 분위기 선택 영역 */}
      {showMoodSelection && (
        <div
          className="border-t border-gray-200 bg-white/90 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/90"
          style={{
            animation: "slideDown 0.5s ease-out forwards",
          }}
        >
          <div className="mx-auto max-w-4xl p-8">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                스타일 설정
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                원하는 분위기와 스타일을 선택해주세요
              </p>
            </div>

            {/* 스타일 선택 영역 */}
            <StyleSelectionSection
              selectedMoods={selectedMoods}
              onMoodToggle={handleMoodToggle}
              selectedIntents={selectedIntents}
              onIntentSelect={handleIntentSelect}
              keywords={keywords}
              onKeywordAdd={handleKeywordAdd}
              onKeywordRemove={handleKeywordRemove}
              maxSelectionError={maxSelectionError}
              validationConfig={DEFAULT_VALIDATION_CONFIG}
            />

            {/* 고급 설정 영역 */}
            <AdvancedSettingsSection
              showAdvancedSettings={showAdvancedSettings}
              onToggleAdvancedSettings={() =>
                setShowAdvancedSettings(!showAdvancedSettings)
              }
              selectedLength={selectedLength}
              onLengthSelect={handleLengthSelect}
              selectedTimeframe={selectedTimeframe}
              onTimeframeSelect={handleTimeframeSelect}
              selectedWeather={selectedWeather}
              onWeatherSelect={handleWeatherSelect}
            />

            {/* 진행률 및 생성 버튼 영역 */}
            <ProgressSection
              isCreatingPromotion={isCreatingPromotion}
              progress={progress}
              canCreatePromotion={canCreatePromotionValue}
              selectedMoods={selectedMoods}
              keywords={keywords}
              selectedIntents={selectedIntents}
              onCreatePromotion={handleCreatePromotion}
            />
          </div>
        </div>
      )}

      {/* 토큰 확인 Alert Dialog */}
      <TokenAlertDialog
        open={showTokenAlert}
        onOpenChange={setShowTokenAlert}
        message={tokenAlertMessage}
      />

      {/* 애니메이션 스타일 */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
