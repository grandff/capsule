import { useState } from "react";

import { Badge } from "~/core/components/ui/badge";
import { Button } from "~/core/components/ui/button";
import { Card, CardContent } from "~/core/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/core/components/ui/dialog";

interface FeedbackResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  originalText: string;
  feedbackText: string;
  onKeepOriginal: () => void;
  onApplyFeedback: () => void;
}

export function FeedbackResultDialog({
  open,
  onOpenChange,
  originalText,
  feedbackText,
  onKeepOriginal,
  onApplyFeedback,
}: FeedbackResultDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleKeepOriginal = () => {
    setIsLoading(true);
    onKeepOriginal();
    setIsLoading(false);
  };

  const handleApplyFeedback = () => {
    setIsLoading(true);
    onApplyFeedback();
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>피드백 결과</DialogTitle>
          <DialogDescription>
            원본 글과 수정된 글을 비교해보세요
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 원본 글 */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="outline">원본</Badge>
            </div>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                  {originalText}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 수정된 글 */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="default">수정됨</Badge>
            </div>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                  {feedbackText}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 버튼 영역 */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleKeepOriginal}
              disabled={isLoading}
              className="flex-1"
            >
              그대로 유지
            </Button>
            <Button
              onClick={handleApplyFeedback}
              disabled={isLoading}
              className="flex-1"
            >
              반영하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
