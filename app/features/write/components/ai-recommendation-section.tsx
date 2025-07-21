import { BorderBeam } from "components/magicui/border-beam";
import { Check, Copy, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";

import { RECOMMEND_TEXT } from "~/constants";
import { Button } from "~/core/components/ui/button";
import { Card, CardContent, CardHeader } from "~/core/components/ui/card";

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
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const fetcher = useFetcher();

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

  const handleFeedback = (isHelpful: boolean) => {
    fetcher.submit(
      { isHelpful: isHelpful.toString() },
      { method: "post", action: "/dashboard/write/feedback" },
    );
    setFeedbackGiven(true);
    toast.success("피드백을 보내주셔서 감사합니다!");
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

  return (
    <div className="mx-auto max-w-4xl px-6 py-2">
      <Card className="relative gap-3 border border-green-200 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 shadow-sm dark:border-green-800 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-teal-950/30">
        <BorderBeam
          size={40}
          duration={4}
          colorFrom="#10b981"
          colorTo="#059669"
          className="rounded-lg"
        />

        {/* 헤더 */}
        <CardHeader className="pb-0">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                오늘은 이렇게 써보는게 어떨까요?
              </h3>
            </div>
          </div>
        </CardHeader>

        {/* 바디 */}
        <CardContent className="pt-1 pb-2">
          <p className="text-sm leading-5 text-gray-700 dark:text-gray-300">
            {recommendation}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
