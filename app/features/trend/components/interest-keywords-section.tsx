import { Plus, Target, X } from "lucide-react";
import { useState } from "react";
import { useFetcher } from "react-router";
import { toast } from "react-toastify";

import { Badge } from "~/core/components/ui/badge";
import { Button } from "~/core/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";
import { Input } from "~/core/components/ui/input";

interface InterestKeywordsSectionProps {
  initialKeywords: string[];
}

export function InterestKeywordsSection({
  initialKeywords,
}: InterestKeywordsSectionProps) {
  const [interestKeywords, setInterestKeywords] =
    useState<string[]>(initialKeywords);
  const [newKeyword, setNewKeyword] = useState("");
  const fetcher = useFetcher();

  const addKeyword = () => {
    const trimmedKeyword = newKeyword.trim();
    if (trimmedKeyword && !interestKeywords.includes(trimmedKeyword)) {
      const updatedKeywords = [...interestKeywords, trimmedKeyword];
      setInterestKeywords(updatedKeywords);
      setNewKeyword("");

      // 즉시 저장
      fetcher.submit(
        { keywords: JSON.stringify(updatedKeywords) },
        { method: "post" },
      );
    }
  };

  const removeKeyword = (keyword: string) => {
    const updatedKeywords = interestKeywords.filter((k) => k !== keyword);
    setInterestKeywords(updatedKeywords);

    // 즉시 저장
    fetcher.submit(
      { keywords: JSON.stringify(updatedKeywords) },
      { method: "post" },
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addKeyword();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          관심 키워드 설정
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          관심 있는 키워드를 설정하면 매일 아침 해당 키워드 기반으로 트렌드를
          분석해드립니다. 평소 자주 사용하는 단어나 관심 있는 주제를
          입력해주세요.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 키워드 입력 */}
          <div className="flex gap-2">
            <Input
              placeholder="예: AI, 마케팅, 스타트업, 브랜딩..."
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
              disabled={fetcher.state === "submitting"}
            />
            <Button
              onClick={addKeyword}
              size="sm"
              disabled={fetcher.state === "submitting" || !newKeyword.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* 입력된 키워드 목록 */}
          {interestKeywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {interestKeywords.map((keyword, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {keyword}
                  <button
                    onClick={() => removeKeyword(keyword)}
                    className="ml-1 rounded-full p-0.5 hover:bg-gray-300 dark:hover:bg-gray-600"
                    disabled={fetcher.state === "submitting"}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* 저장 상태 표시 */}
          {fetcher.state === "submitting" && (
            <p className="text-muted-foreground text-sm">저장 중...</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
