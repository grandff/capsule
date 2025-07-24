import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";

import { Badge } from "~/core/components/ui/badge";
import { Button } from "~/core/components/ui/button";
import { Card, CardContent } from "~/core/components/ui/card";
import { Input } from "~/core/components/ui/input";

export function InterestKeywordsWidget() {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const fetcher = useFetcher();

  // fetcher 상태에 따른 toast 표시
  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.success) {
        toast.success(fetcher.data.message);
      } else {
        toast.error(fetcher.data.message || "키워드 저장에 실패했습니다.");
      }
    }
  }, [fetcher.data]);

  const handleAddKeyword = () => {
    if (inputValue.trim() && !keywords.includes(inputValue.trim())) {
      const newKeywords = [...keywords, inputValue.trim()];
      setKeywords(newKeywords);
      setInputValue("");

      // 키워드 추가 시 바로 저장
      fetcher.submit(
        { keywords: JSON.stringify(newKeywords) },
        { method: "post", action: "/dashboard/trend" },
      );
    }
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    const newKeywords = keywords.filter(
      (keyword) => keyword !== keywordToRemove,
    );
    setKeywords(newKeywords);

    // 키워드 제거 시 바로 저장
    fetcher.submit(
      { keywords: JSON.stringify(newKeywords) },
      { method: "post", action: "/dashboard/trend" },
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  return (
    <Card>
      <CardContent className="space-y-4 px-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">관심 키워드</label>
          <div className="flex gap-2">
            <Input
              placeholder="키워드를 입력하세요 (예: 브랜딩, 마케팅)"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleAddKeyword} size="sm">
              추가
            </Button>
          </div>
        </div>

        {keywords.length > 0 && (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {keyword}
                  <button
                    onClick={() => handleRemoveKeyword(keyword)}
                    className="hover:text-destructive ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
