import type { PromptTemplate } from "../schema";

import { AnimatedCircularProgressBar } from "components/magicui/animated-circular-progress-bar";
import { ChevronDownIcon, Loader2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

import {
  INTENT_OPTIONS,
  LENGTH_OPTIONS,
  MOOD_OPTIONS,
  TIMEFRAME_OPTIONS,
  WEATHER_OPTIONS,
} from "~/constants";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/core/components/ui/alert-dialog";
import { Badge } from "~/core/components/ui/badge";
import { Button } from "~/core/components/ui/button";
import { Input } from "~/core/components/ui/input";
import { Textarea } from "~/core/components/ui/textarea";

export default function WriteToday() {
  const [text, setText] = useState("");
  const [showMoodSelection, setShowMoodSelection] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [showAllMoods, setShowAllMoods] = useState(false);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [selectedIntents, setSelectedIntents] = useState<string[]>([]);
  const [selectedLength, setSelectedLength] = useState<string>("");
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("");
  const [selectedWeather, setSelectedWeather] = useState<string>("");
  const [keywordInput, setKeywordInput] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isCreatingPromotion, setIsCreatingPromotion] = useState(false);
  const [maxSelectionError, setMaxSelectionError] = useState<string>("");
  const [selectedPrompt, setSelectedPrompt] = useState<PromptTemplate | null>(
    null,
  );
  const [progress, setProgress] = useState(0);
  const [isTextReadonly, setIsTextReadonly] = useState(false);
  const [moodButtonText, setMoodButtonText] = useState("홍보글 설정하기");
  const [writeMode, setWriteMode] = useState<"good" | "search">("good");
  const [showTokenAlert, setShowTokenAlert] = useState(false);
  const [tokenAlertMessage, setTokenAlertMessage] = useState("");

  const navigate = useNavigate();
  const maxLength = 100;
  const minLengthForMood = 10;

  // 최대 선택 개수 설정
  const MAX_MOODS = 3;

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // 최초 렌더링 시 textarea에 포커스
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // 텍스트 변경 핸들러
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setText(value);
    }
  };

  // 분위기 선택 핸들러
  const handleMoodToggle = (mood: string) => {
    if (selectedMoods.includes(mood)) {
      // 이미 선택된 항목이면 제거
      setSelectedMoods((prev) => prev.filter((m) => m !== mood));
      setMaxSelectionError(""); // 에러 메시지 제거
    } else {
      // 새로운 항목 선택 시 최대 개수 확인
      if (selectedMoods.length >= MAX_MOODS) {
        setMaxSelectionError(
          `분위기는 최대 ${MAX_MOODS}개까지 선택 가능합니다.`,
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
  const handleKeywordAdd = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords((prev) => [...prev, keywordInput.trim()]);
      setKeywordInput("");
    }
  };

  // 키워드 삭제 핸들러
  const handleKeywordRemove = (keyword: string) => {
    setKeywords((prev) => prev.filter((k) => k !== keyword));
  };

  // 키워드 입력 엔터 핸들러
  const handleKeywordKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleKeywordAdd();
    }
  };

  // 홍보글 만들기 버튼 활성화 조건
  const canCreatePromotion =
    selectedMoods.length > 0 &&
    keywords.length > 0 &&
    selectedIntents.length > 0;

  // 필요한 선택사항 안내 메시지 생성
  const getRequiredSelectionsMessage = () => {
    const missingItems = [];

    if (selectedMoods.length === 0) missingItems.push("분위기");
    if (keywords.length === 0) missingItems.push("핵심 키워드");
    if (selectedIntents.length === 0) missingItems.push("목적");

    if (missingItems.length === 0) return null;

    return `다음 항목을 선택해주세요: ${missingItems.join(", ")}`;
  };

  // 홍보글 만들기 핸들러
  const handleCreatePromotion = async () => {
    if (!canCreatePromotion) return;

    setIsCreatingPromotion(true);
    setProgress(0);

    try {
      // 1. 프롬프트 가져오기
      const prompts = await fetch("/api/write/prompts");
      const promptsData = await prompts.json();

      // 2. 생성 요청
      const formData = new FormData();
      formData.append("prompt", promptsData.prompts);
      formData.append("text", text);
      formData.append("mood", selectedMoods.join(","));
      formData.append("keyword", keywords.join(","));
      formData.append("intent", selectedIntents[0] || "미설정");
      formData.append(
        "length",
        selectedLength.length > 0 ? selectedLength : "미설정",
      );
      formData.append(
        "timeframe",
        selectedTimeframe.length > 0 ? selectedTimeframe : "미설정",
      );
      formData.append(
        "weather",
        selectedWeather.length > 0 ? selectedWeather : "미설정",
      );

      const response = await fetch("/api/chatgpt/create-gpt-idea", {
        method: "POST",
        body: formData,
      });

      const { completion } = await response.json();

      // 3. 5초 카운트 시작
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 20;
          if (newProgress >= 100) {
            clearInterval(interval);

            // 4. completion이 있으면 페이지 이동
            if (completion) {
              // 결과 데이터 준비
              const result = {
                content: completion,
                originalText: text,
                moods: selectedMoods,
                keywords,
                intents: selectedIntents,
                length: selectedLength,
                timeframe: selectedTimeframe,
                weather: selectedWeather,
              };

              // 결과 데이터를 URL 파라미터로 전달
              const params = new URLSearchParams({
                result: JSON.stringify(result),
              });

              navigate(`/dashboard/write/result?${params.toString()}`);
            } else {
              // completion이 없으면 에러 처리
              console.error("GPT 응답을 받지 못했습니다.");
              setIsCreatingPromotion(false);
              setProgress(0);
            }
            return 100;
          }
          return newProgress;
        });
      }, 1000);
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
      try {
        const response = await fetch("/api/write/check-token", {
          method: "POST",
        });

        const result = await response.json();

        if (!result.success) {
          setTokenAlertMessage(result.message);
          setShowTokenAlert(true);
          return;
        }

        // 토큰이 있으면 홍보글 설정 화면으로 이동
        setShowMoodSelection(true);
        setIsTextReadonly(true);
        setMoodButtonText("다시 작성하기");
      } catch (error) {
        console.error("토큰 확인 중 오류:", error);
        setTokenAlertMessage("토큰 확인 중 오류가 발생했습니다.");
        setShowTokenAlert(true);
      }
    } else {
      setShowMoodSelection(false);
      setIsTextReadonly(false);
      setMoodButtonText("홍보글 설정하기");
      // 다시 작성하기 버튼을 누르면 textarea에 포커스
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 0);
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

      {/* 메인 컨텐츠 영역 */}
      <div className="flex flex-1 items-start justify-center p-6">
        <div className="w-full max-w-3xl">
          {/* 텍스트 에어리어 영역 */}
          <div className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-gray-200/50 dark:bg-gray-800 dark:ring-gray-700/50">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                어떤 이야기를 들려주실 건가요?
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                최소 10자 이상 작성해주세요
              </p>
            </div>

            <Textarea
              ref={textareaRef}
              value={text}
              onChange={handleTextChange}
              placeholder="오늘 있었던 일, 느낀 점, 또는 전하고 싶은 메시지를 자유롭게 작성해보세요!"
              className="min-h-[120px] resize-none border-0 bg-transparent text-lg leading-relaxed focus:ring-0 focus:outline-none dark:text-white dark:placeholder:text-gray-400"
              maxLength={maxLength}
              readOnly={isTextReadonly}
            />

            {/* 글자수 표시 */}
            <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {text.length >= minLengthForMood ? (
                  <span className="text-green-600 dark:text-green-400">
                    ✓ 이제 홍보글 설정하기 버튼을 눌러보세요!
                  </span>
                ) : (
                  <span className="text-red-500 dark:text-red-400">
                    {minLengthForMood - text.length}글자 더 작성해주세요!
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {text.length}/{maxLength}
              </div>
            </div>
          </div>

          {/* 분위기 선택 버튼 */}
          <div className="mt-6 flex justify-center">
            <Button
              onClick={handleMoodButtonClick}
              disabled={text.length < minLengthForMood}
              className={`px-8 py-5 text-lg font-medium transition-all duration-200 ${
                text.length >= minLengthForMood
                  ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                  : "cursor-not-allowed bg-gray-300 text-gray-500 dark:bg-gray-600 dark:text-gray-400"
              }`}
            >
              {moodButtonText}
            </Button>
          </div>
        </div>
      </div>

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

            {/* 생성 방식 선택 UI */}
            <div className="mb-8 flex flex-col items-center gap-4">
              <div className="flex gap-4">
                <Button
                  variant={writeMode === "good" ? "default" : "outline"}
                  onClick={() => setWriteMode("good")}
                  className={`px-6 py-3 text-base font-medium ${
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
                  className="cursor-not-allowed border-gray-300 px-6 py-3 text-base font-medium text-gray-500 opacity-50 dark:border-gray-600 dark:text-gray-400"
                >
                  검색이 필요해요
                </Button>
              </div>
              <p className="text-sm text-red-500 dark:text-red-400">
                검색 기능은 곧 만나볼 수 있어요! 👋
              </p>
            </div>

            <div className="space-y-8">
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
                      variant={
                        selectedIntents.includes(intent) ? "default" : "outline"
                      }
                      className={`cursor-pointer px-4 py-2 text-sm font-medium transition-all ${selectedIntents.includes(intent) ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600" : "hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"}`}
                      onClick={() => setSelectedIntents([intent])}
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
                  {selectedMoods.length < MAX_MOODS ? (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {MAX_MOODS - selectedMoods.length}개 더 선택 가능해요!
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
                        variant={
                          selectedMoods.includes(mood) ? "default" : "outline"
                        }
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
                        onClick={() => handleKeywordRemove(keyword)}
                      >
                        {keyword} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* 더 자세하게 설정하기 버튼 */}
              <div className="flex justify-center pt-4">
                <Button
                  onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                  variant="outline"
                  className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  더 자세하게 설정하기
                  <ChevronDownIcon
                    className={`size-4 transition-transform duration-200 ${
                      showAdvancedSettings ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </div>

              {/* 고급 설정 영역 */}
              {showAdvancedSettings && (
                <div
                  className="space-y-8 border-t border-gray-200 pt-8 dark:border-gray-700"
                  style={{
                    animation: "slideDown 0.3s ease-out forwards",
                  }}
                >
                  {/* 글 길이 선택 */}
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                      얼마나 길게 쓸까요?
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {LENGTH_OPTIONS.map((length) => (
                        <Badge
                          key={length}
                          variant={
                            selectedLength === length ? "default" : "outline"
                          }
                          className={`cursor-pointer px-4 py-2 text-sm font-medium transition-all ${
                            selectedLength === length
                              ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                              : "hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                          }`}
                          onClick={() => handleLengthSelect(length)}
                        >
                          {length}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* 시점/상황 설정 */}
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                      언제/어떤 상황에 맞는 글인가요?
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {TIMEFRAME_OPTIONS.map((timeframe) => (
                        <Badge
                          key={timeframe}
                          variant={
                            selectedTimeframe === timeframe
                              ? "default"
                              : "outline"
                          }
                          className={`cursor-pointer px-4 py-2 text-sm font-medium transition-all ${
                            selectedTimeframe === timeframe
                              ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                              : "hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                          }`}
                          onClick={() => handleTimeframeSelect(timeframe)}
                        >
                          {timeframe}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* 날씨 선택 */}
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                      어떤 날씨에 어울리는 글인가요?
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {WEATHER_OPTIONS.map((weather) => (
                        <Badge
                          key={weather}
                          variant={
                            selectedWeather === weather ? "default" : "outline"
                          }
                          className={`cursor-pointer px-4 py-2 text-sm font-medium transition-all ${
                            selectedWeather === weather
                              ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                              : "hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                          }`}
                          onClick={() => handleWeatherSelect(weather)}
                        >
                          {weather}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 필요한 선택사항 안내 */}
              {!canCreatePromotion && (
                <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    ⚠️ {getRequiredSelectionsMessage()}
                  </p>
                </div>
              )}

              {/* 홍보글 만들기 버튼 */}
              <div className="flex flex-col items-center space-y-4 pt-6">
                {isCreatingPromotion && (
                  <div className="w-full max-w-md">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        홍보글 생성 중...
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {progress}%
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className="h-full bg-green-600 dark:bg-green-500"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                <Button
                  disabled={!canCreatePromotion || isCreatingPromotion}
                  onClick={handleCreatePromotion}
                  className={`px-8 py-5 text-lg font-semibold transition-all duration-300 ${
                    canCreatePromotion && !isCreatingPromotion
                      ? "bg-green-600 text-white shadow-lg hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                      : "cursor-not-allowed bg-gray-300 text-gray-500 dark:bg-gray-600 dark:text-gray-400"
                  }`}
                >
                  {isCreatingPromotion ? "생성 중..." : "홍보글 만들기"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 토큰 확인 Alert Dialog */}
      <AlertDialog open={showTokenAlert} onOpenChange={setShowTokenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Threads 계정 연결 필요</AlertDialogTitle>
            <AlertDialogDescription>
              {tokenAlertMessage}
              <br />
              <br />
              홍보글을 작성하려면 먼저 Threads 계정을 연결해주세요.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => navigate("/dashboard/sns/connect")}
            >
              Threads 연결하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
