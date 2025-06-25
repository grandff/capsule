import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

import { Badge } from "~/core/components/ui/badge";
import { Button } from "~/core/components/ui/button";
import { Input } from "~/core/components/ui/input";
import { Textarea } from "~/core/components/ui/textarea";

export default function WriteToday() {
  const [text, setText] = useState("");
  const [showMoodSelection, setShowMoodSelection] = useState(false);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedTones, setSelectedTones] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isCreatingPromotion, setIsCreatingPromotion] = useState(false);

  const navigate = useNavigate();
  const maxLength = 100;
  const minLengthForMood = 10;

  // 분위기 옵션
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
  ];

  // 산업군 옵션
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
  ];

  // 톤 옵션
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
    setSelectedMoods((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood],
    );
  };

  // 산업군 선택 핸들러
  const handleIndustryToggle = (industry: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(industry)
        ? prev.filter((i) => i !== industry)
        : [...prev, industry],
    );
  };

  // 톤 선택 핸들러
  const handleToneToggle = (tone: string) => {
    setSelectedTones((prev) =>
      prev.includes(tone) ? prev.filter((t) => t !== tone) : [...prev, tone],
    );
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

  // 홍보글 만들기 핸들러
  const handleCreatePromotion = async () => {
    if (!canCreatePromotion) return;

    setIsCreatingPromotion(true);

    // TODO: ChatGPT API 호출 로직 구현 필요
    // const result = await callChatGPTAPI({
    //   text,
    //   moods: selectedMoods,
    //   industries: selectedIndustries,
    //   tones: selectedTones,
    //   keywords,
    // });

    // 5초 대기 (실제로는 API 응답 시간)
    setTimeout(() => {
      // TODO: 실제 API 결과를 전달해야 함
      const mockResult = {
        content: "생성된 홍보글 내용이 여기에 표시됩니다...",
        originalText: text,
        moods: selectedMoods,
        industries: selectedIndustries,
        tones: selectedTones,
        keywords,
      };

      // 결과 데이터를 URL 파라미터로 전달 (실제로는 세션 스토리지나 상태 관리 사용 권장)
      const params = new URLSearchParams({
        result: JSON.stringify(mockResult),
      });

      navigate(`/dashboard/write/result?${params.toString()}`);
    }, 5000);
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* 메인 컨텐츠 영역 */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {/* 텍스트 에어리어 영역 */}
          <div className="relative rounded-2xl p-8 shadow-lg">
            <Textarea
              value={text}
              onChange={handleTextChange}
              placeholder="오늘의 이야기를 작성해보세요!"
              className="min-h-[100px] resize-none border-0 text-lg focus:ring-0 focus:outline-none"
              maxLength={maxLength}
            />
            {/* 글자수 표시 */}
            <div className="absolute right-8 bottom-2 text-sm text-gray-500">
              {text.length}/{maxLength}
            </div>
          </div>

          {/* 분위기 선택 버튼 */}
          <div className="mt-6 flex justify-center">
            <Button
              onClick={() => setShowMoodSelection(!showMoodSelection)}
              disabled={text.length < minLengthForMood}
              className={`px-8 py-3 text-lg font-medium transition-all duration-200 ${
                text.length >= minLengthForMood
                  ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700"
                  : "cursor-not-allowed bg-gray-300 text-gray-500"
              }`}
            >
              분위기 선택
            </Button>
          </div>
        </div>
      </div>

      {/* 분위기 선택 영역 */}
      {showMoodSelection && (
        <div className="p-6">
          <div className="mx-auto max-w-4xl space-y-8">
            {/* 분위기 선택 */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">분위기</h3>
              <div className="flex flex-wrap gap-2">
                {moodOptions.map((mood) => (
                  <Badge
                    key={mood}
                    variant={
                      selectedMoods.includes(mood) ? "default" : "outline"
                    }
                    className={`cursor-pointer transition-all ${
                      selectedMoods.includes(mood)
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => handleMoodToggle(mood)}
                  >
                    {mood}
                  </Badge>
                ))}
              </div>
            </div>

            {/* 산업군 선택 */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">산업군</h3>
              <div className="flex flex-wrap gap-2">
                {industryOptions.map((industry) => (
                  <Badge
                    key={industry}
                    variant={
                      selectedIndustries.includes(industry)
                        ? "default"
                        : "outline"
                    }
                    className={`cursor-pointer transition-all ${
                      selectedIndustries.includes(industry)
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => handleIndustryToggle(industry)}
                  >
                    {industry}
                  </Badge>
                ))}
              </div>
            </div>

            {/* 톤 선택 */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">톤</h3>
              <div className="flex flex-wrap gap-2">
                {toneOptions.map((tone) => (
                  <Badge
                    key={tone}
                    variant={
                      selectedTones.includes(tone) ? "default" : "outline"
                    }
                    className={`cursor-pointer transition-all ${
                      selectedTones.includes(tone)
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => handleToneToggle(tone)}
                  >
                    {tone}
                  </Badge>
                ))}
              </div>
            </div>

            {/* 키워드 입력 */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">핵심 키워드</h3>
              <div className="mb-3 flex gap-2">
                <Input
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={handleKeywordKeyPress}
                  placeholder="키워드를 입력하고 Enter를 누르세요"
                  className="flex-1"
                />
                <Button
                  onClick={handleKeywordAdd}
                  disabled={!keywordInput.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
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
                      className="cursor-pointer bg-blue-100 text-blue-800 hover:bg-blue-200"
                      onClick={() => handleKeywordRemove(keyword)}
                    >
                      {keyword} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* 홍보글 만들기 버튼 */}
            <div className="flex justify-center pt-4">
              <Button
                disabled={!canCreatePromotion || isCreatingPromotion}
                onClick={handleCreatePromotion}
                className={`px-8 py-3 text-lg font-medium transition-all duration-200 ${
                  canCreatePromotion && !isCreatingPromotion
                    ? "bg-green-600 text-white shadow-lg hover:bg-green-700"
                    : "cursor-not-allowed bg-gray-300 text-gray-500"
                }`}
              >
                {isCreatingPromotion ? (
                  <>
                    <Loader2Icon className="mr-2 size-5 animate-spin" />
                    홍보글 생성 중...
                  </>
                ) : (
                  "홍보글 만들기"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
