import type { PromptTemplate } from "../schema";

import { AnimatedCircularProgressBar } from "components/magicui/animated-circular-progress-bar";
import { ChevronDownIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

import { Badge } from "~/core/components/ui/badge";
import { Button } from "~/core/components/ui/button";
import { Input } from "~/core/components/ui/input";
import { Textarea } from "~/core/components/ui/textarea";

export default function WriteToday() {
  const [text, setText] = useState("");
  const [showMoodSelection, setShowMoodSelection] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [showAllMoods, setShowAllMoods] = useState(false);
  const [showAllIndustries, setShowAllIndustries] = useState(false);
  const [showAllTones, setShowAllTones] = useState(false);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedTones, setSelectedTones] = useState<string[]>([]);
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

  const navigate = useNavigate();
  const maxLength = 100;
  const minLengthForMood = 10;

  // 최대 선택 개수 설정
  const MAX_MOODS = 3;
  const MAX_INDUSTRIES = 2;
  const MAX_TONES = 3;

  // 분위기 옵션 (확장)
  const moodOptions = [
    "친근한",
    "전문적인",
    "재미있는",
    "감성적인",
    "신뢰감 있는",
    "활기찬",
    "차분한",
    "열정적인",
    "신중한",
    "창의적인",
    "우아한",
    "힘있는",
    "편안한",
    "긴장감 있는",
    "희망찬",
    "진지한",
    "유쾌한",
    "감사한",
    "자신감 있는",
    "따뜻한",
  ];

  // 산업군 옵션 (확장)
  const industryOptions = [
    "IT/기술",
    "금융",
    "의료",
    "교육",
    "엔터테인먼트",
    "패션",
    "음식",
    "여행",
    "부동산",
    "자동차",
    "뷰티",
    "스포츠",
    "게임",
    "미디어",
    "마케팅",
    "법무",
    "건설",
    "제조업",
    "물류",
    "환경",
    "에너지",
    "농업",
    "반도체",
    "AI/머신러닝",
    "블록체인",
  ];

  // 톤 옵션 (확장)
  const toneOptions = [
    "공식적",
    "친근함",
    "유머러스",
    "감성적",
    "전문적",
    "격식있음",
    "캐주얼",
    "열정적",
    "신중함",
    "창의적",
    "설명적",
    "설득적",
    "정보성",
    "스토리텔링",
    "대화체",
    "보고서형",
    "칼럼형",
    "소개형",
    "추천형",
    "리뷰형",
  ];

  // 의도 옵션
  const intentOptions = [
    "제품홍보",
    "이벤트 안내",
    "일상 공유",
    "후기/리뷰",
    "브랜딩",
    "고객유치",
    "단골 소통",
    "뉴스 공유",
    "인사이트 전달",
    "서비스 소개",
  ];

  // 글 길이 옵션
  const lengthOptions = ["짧게 임팩트 있게", "표준형", "설명위주로 길게"];

  // 시점/상황 옵션
  const timeframeOptions = ["오늘", "이번주말", "다음주", "특정일자"];

  // 날씨 옵션
  const weatherOptions = [
    "맑음",
    "흐림",
    "비",
    "눈",
    "더움",
    "추움",
    "시원함",
    "따뜻함",
  ];

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

  // 산업군 선택 핸들러
  const handleIndustryToggle = (industry: string) => {
    if (selectedIndustries.includes(industry)) {
      // 이미 선택된 항목이면 제거
      setSelectedIndustries((prev) => prev.filter((i) => i !== industry));
      setMaxSelectionError(""); // 에러 메시지 제거
    } else {
      // 새로운 항목 선택 시 최대 개수 확인
      if (selectedIndustries.length >= MAX_INDUSTRIES) {
        setMaxSelectionError(
          `산업군은 최대 ${MAX_INDUSTRIES}개까지 선택 가능합니다.`,
        );
        // 3초 후 에러 메시지 자동 제거
        setTimeout(() => setMaxSelectionError(""), 3000);
        return;
      }
      setSelectedIndustries((prev) => [...prev, industry]);
      setMaxSelectionError(""); // 에러 메시지 제거
    }
  };

  // 톤 선택 핸들러
  const handleToneToggle = (tone: string) => {
    if (selectedTones.includes(tone)) {
      // 이미 선택된 항목이면 제거
      setSelectedTones((prev) => prev.filter((t) => t !== tone));
      setMaxSelectionError(""); // 에러 메시지 제거
    } else {
      // 새로운 항목 선택 시 최대 개수 확인
      if (selectedTones.length >= MAX_TONES) {
        setMaxSelectionError(`톤은 최대 ${MAX_TONES}개까지 선택 가능합니다.`);
        // 3초 후 에러 메시지 자동 제거
        setTimeout(() => setMaxSelectionError(""), 3000);
        return;
      }
      setSelectedTones((prev) => [...prev, tone]);
      setMaxSelectionError(""); // 에러 메시지 제거
    }
  };

  // 의도 선택 핸들러
  const handleIntentToggle = (intent: string) => {
    setSelectedIntents((prev) =>
      prev.includes(intent)
        ? prev.filter((i) => i !== intent)
        : [...prev, intent],
    );
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
    selectedIndustries.length > 0 &&
    selectedTones.length > 0 &&
    keywords.length > 0;

  // 필요한 선택사항 안내 메시지 생성
  const getRequiredSelectionsMessage = () => {
    const missingItems = [];

    if (selectedMoods.length === 0) missingItems.push("분위기");
    if (selectedIndustries.length === 0) missingItems.push("산업군");
    if (selectedTones.length === 0) missingItems.push("톤");
    if (keywords.length === 0) missingItems.push("핵심 키워드");

    if (missingItems.length === 0) return null;

    return `다음 항목을 선택해주세요: ${missingItems.join(", ")}`;
  };

  // 홍보글 만들기 핸들러
  const handleCreatePromotion = async () => {
    if (!canCreatePromotion) return;

    setIsCreatingPromotion(true);
    setProgress(0);

    // 5초 동안 20%씩 증가 (총 5번, 1초마다)
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 20;
        if (newProgress >= 100) {
          clearInterval(interval);

          // 결과 데이터 준비
          const mockResult = {
            content:
              "안녕하세요! 오늘은 정말 특별한 하루였습니다. 여러분과 함께 이 순간을 공유하고 싶어서 글을 남깁니다. 항상 감사하고, 앞으로도 좋은 일들이 가득하길 바랍니다! 💫 #일상 #감사 #행복",
            originalText: text,
            moods: selectedMoods,
            industries: selectedIndustries,
            tones: selectedTones,
            keywords,
            intents: selectedIntents,
            length: selectedLength,
            timeframe: selectedTimeframe,
            weather: selectedWeather,
          };

          // 결과 데이터를 URL 파라미터로 전달
          const params = new URLSearchParams({
            result: JSON.stringify(mockResult),
          });

          navigate(`/dashboard/write/result?${params.toString()}`);
          return 100;
        }
        return newProgress;
      });
    }, 1000);
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
              value={text}
              onChange={handleTextChange}
              placeholder="오늘 있었던 일, 느낀 점, 또는 전하고 싶은 메시지를 자유롭게 작성해보세요!"
              className="min-h-[120px] resize-none border-0 bg-transparent text-lg leading-relaxed focus:ring-0 focus:outline-none dark:text-white dark:placeholder:text-gray-400"
              maxLength={maxLength}
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
              onClick={() => setShowMoodSelection(!showMoodSelection)}
              disabled={text.length < minLengthForMood}
              className={`px-8 py-3 text-lg font-medium transition-all duration-200 ${
                text.length >= minLengthForMood
                  ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                  : "cursor-not-allowed bg-gray-300 text-gray-500 dark:bg-gray-600 dark:text-gray-400"
              }`}
            >
              홍보글 설정하기
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
                홍보글 스타일 설정
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                원하는 분위기와 스타일을 선택해주세요
              </p>
            </div>

            <div className="space-y-8">
              {/* 분위기 선택 */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    분위기
                  </h3>
                  {selectedMoods.length < MAX_MOODS ? (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {MAX_MOODS - selectedMoods.length}개 더 선택 가능
                    </span>
                  ) : (
                    <span className="text-sm text-red-500 dark:text-red-400">
                      최대 선택 완료
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {(showAllMoods ? moodOptions : moodOptions.slice(0, 5)).map(
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
                {moodOptions.length > 5 && (
                  <div className="mt-3">
                    <Button
                      onClick={() => setShowAllMoods(!showAllMoods)}
                      variant="outline"
                      size="sm"
                      className="border-gray-300 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      {showAllMoods
                        ? "접기"
                        : `더 보기 (${moodOptions.length - 5}개 더)`}
                    </Button>
                  </div>
                )}
              </div>

              {/* 산업군 선택 */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    산업군
                  </h3>
                  {selectedIndustries.length < MAX_INDUSTRIES ? (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {MAX_INDUSTRIES - selectedIndustries.length}개 더 선택
                      가능
                    </span>
                  ) : (
                    <span className="text-sm text-red-500 dark:text-red-400">
                      최대 선택 완료
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {(showAllIndustries
                    ? industryOptions
                    : industryOptions.slice(0, 5)
                  ).map((industry) => (
                    <Badge
                      key={industry}
                      variant={
                        selectedIndustries.includes(industry)
                          ? "default"
                          : "outline"
                      }
                      className={`cursor-pointer px-4 py-2 text-sm font-medium transition-all ${
                        selectedIndustries.includes(industry)
                          ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                          : "hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => handleIndustryToggle(industry)}
                    >
                      {industry}
                    </Badge>
                  ))}
                </div>
                {industryOptions.length > 5 && (
                  <div className="mt-3">
                    <Button
                      onClick={() => setShowAllIndustries(!showAllIndustries)}
                      variant="outline"
                      size="sm"
                      className="border-gray-300 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      {showAllIndustries
                        ? "접기"
                        : `더 보기 (${industryOptions.length - 5}개 더)`}
                    </Button>
                  </div>
                )}
              </div>

              {/* 톤 선택 */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    톤
                  </h3>
                  {selectedTones.length < MAX_TONES ? (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {MAX_TONES - selectedTones.length}개 더 선택 가능
                    </span>
                  ) : (
                    <span className="text-sm text-red-500 dark:text-red-400">
                      최대 선택 완료
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {(showAllTones ? toneOptions : toneOptions.slice(0, 5)).map(
                    (tone) => (
                      <Badge
                        key={tone}
                        variant={
                          selectedTones.includes(tone) ? "default" : "outline"
                        }
                        className={`cursor-pointer px-4 py-2 text-sm font-medium transition-all ${
                          selectedTones.includes(tone)
                            ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                            : "hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                        }`}
                        onClick={() => handleToneToggle(tone)}
                      >
                        {tone}
                      </Badge>
                    ),
                  )}
                </div>
                {toneOptions.length > 5 && (
                  <div className="mt-3">
                    <Button
                      onClick={() => setShowAllTones(!showAllTones)}
                      variant="outline"
                      size="sm"
                      className="border-gray-300 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      {showAllTones
                        ? "접기"
                        : `더 보기 (${toneOptions.length - 5}개 더)`}
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
                  핵심 키워드
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
                  {/* 의도 선택 */}
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                      의도
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {intentOptions.map((intent) => (
                        <Badge
                          key={intent}
                          variant={
                            selectedIntents.includes(intent)
                              ? "default"
                              : "outline"
                          }
                          className={`cursor-pointer px-4 py-2 text-sm font-medium transition-all ${
                            selectedIntents.includes(intent)
                              ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                              : "hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                          }`}
                          onClick={() => handleIntentToggle(intent)}
                        >
                          {intent}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* 글 길이 선택 */}
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                      글 길이
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {lengthOptions.map((length) => (
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
                      시점/상황
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {timeframeOptions.map((timeframe) => (
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
                      날씨
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {weatherOptions.map((weather) => (
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
                  className={`px-12 py-4 text-lg font-semibold transition-all duration-300 ${
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
