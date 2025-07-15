import { Check, Copy, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "~/core/components/ui/button";
import { Card, CardContent } from "~/core/components/ui/card";

interface AIRecommendationSectionProps {
  recommendation?: string;
  isLoading?: boolean;
  onUseRecommendation?: (text: string) => void;
}

export function AIRecommendationSection({
  recommendation,
  isLoading = false,
  onUseRecommendation,
}: AIRecommendationSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!recommendation) return;

    try {
      await navigator.clipboard.writeText(recommendation);
      setCopied(true);
      toast.success("추천 내용이 클립보드에 복사되었습니다.");

      // 2초 후 복사 상태 초기화
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("복사에 실패했습니다.");
    }
  };

  const handleUseRecommendation = () => {
    if (recommendation && onUseRecommendation) {
      onUseRecommendation(recommendation);
      toast.success("추천 내용이 입력창에 적용되었습니다.");
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-4">
        <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                AI가 오늘의 추천 내용을 생성하고 있습니다...
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-4">
        <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                AI 추천 기능을 준비 중입니다
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          이렇게 써보면 어떨까요?
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          AI가 오늘의 트렌드와 사용자 데이터를 분석해서 추천한 내용입니다
        </p>
      </div>

      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:border-blue-800 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-3 flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-medium tracking-wide text-blue-600 uppercase dark:text-blue-400">
                  AI 추천
                </span>
              </div>
              <p className="leading-relaxed whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                {recommendation}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end space-x-2 border-t border-blue-200 pt-4 dark:border-blue-800">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="text-xs"
            >
              {copied ? (
                <>
                  <Check className="mr-1 h-3 w-3" />
                  복사됨
                </>
              ) : (
                <>
                  <Copy className="mr-1 h-3 w-3" />
                  복사하기
                </>
              )}
            </Button>
            <Button
              size="sm"
              onClick={handleUseRecommendation}
              className="bg-blue-600 text-xs hover:bg-blue-700"
            >
              이 내용으로 시작하기
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
