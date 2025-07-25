import {
  CheckCircle2Icon,
  Copy,
  FileText,
  Loader2,
  MessageSquare,
  X,
} from "lucide-react";
import { useState } from "react";

import { Button } from "~/core/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/core/components/ui/dialog";
import { Label } from "~/core/components/ui/label";
import { Textarea } from "~/core/components/ui/textarea";

interface GeneratedContentCardProps {
  content: string;
  isEditing: boolean;
  editedContent: string;
  isCopied: boolean;
  isRequestingFeedback?: boolean;
  hasFeedbackProcessed?: boolean;
  onToggleEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onCopy: () => void;
  onEditedContentChange: (content: string) => void;
  onFeedbackRequest?: (needs: string, etc?: string) => void;
}

export function GeneratedContentCard({
  content,
  isEditing,
  editedContent,
  isCopied,
  isRequestingFeedback = false,
  hasFeedbackProcessed = false,
  onToggleEdit,
  onSaveEdit,
  onCancelEdit,
  onCopy,
  onEditedContentChange,
  onFeedbackRequest,
}: GeneratedContentCardProps) {
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const displayContent = isEditing ? editedContent : content;

  const handleFeedbackSubmit = () => {
    if (!onFeedbackRequest || !feedbackText.trim()) return;

    onFeedbackRequest(feedbackText.trim(), additionalNotes.trim() || undefined);
    setShowFeedbackDialog(false);
    setFeedbackText("");
    setAdditionalNotes("");
  };

  const handleCancelFeedback = () => {
    setShowFeedbackDialog(false);
    setFeedbackText("");
    setAdditionalNotes("");
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">생성된 홍보글</CardTitle>
            <div className="flex items-center gap-2">
              {!isEditing && (
                <>
                  <Button
                    onClick={() => setShowFeedbackDialog(true)}
                    variant="outline"
                    size="sm"
                    disabled={isRequestingFeedback || hasFeedbackProcessed}
                    className="flex items-center gap-2 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40"
                  >
                    {isRequestingFeedback ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <MessageSquare className="size-4" />
                    )}
                    {isRequestingFeedback ? "처리 중..." : "피드백 요청"}
                  </Button>
                  <Button
                    onClick={onToggleEdit}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <FileText className="size-4" />
                    수정하기
                  </Button>
                  <Button
                    onClick={onCopy}
                    variant="outline"
                    size="sm"
                    className={`flex items-center gap-2 transition-all duration-200 ${
                      isCopied
                        ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40"
                        : ""
                    }`}
                  >
                    {isCopied ? (
                      <CheckCircle2Icon className="size-4" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                    {isCopied ? "복사됨" : "복사하기"}
                  </Button>
                </>
              )}
              {isEditing && (
                <>
                  <Button
                    onClick={onSaveEdit}
                    variant="default"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <CheckCircle2Icon className="size-4" />
                    저장
                  </Button>
                  <Button
                    onClick={onCancelEdit}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <X className="size-4" />
                    취소
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <Textarea
              value={editedContent}
              onChange={(e) => onEditedContentChange(e.target.value)}
              className="min-h-[200px] resize-none text-base leading-relaxed"
              placeholder="홍보글을 수정해보세요..."
            />
          ) : (
            <div className="bg-muted rounded-lg p-4">
              <p className="leading-relaxed whitespace-pre-wrap">
                {displayContent}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 피드백 요청 다이얼로그 */}
      <Dialog
        open={showFeedbackDialog}
        onOpenChange={(open) => {
          if (!isRequestingFeedback) {
            setShowFeedbackDialog(open);
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>피드백 요청</DialogTitle>
            <DialogDescription>
              의견을 주시면 반영해서 더 나은 글을 작성해드려요!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="feedback">수정 요청사항</Label>
              <Textarea
                id="feedback"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="어떻게 수정했으면 좋을까요? (예: 더 친근하게 작성해줘, 설명이 더 필요해, 기계같은 말투는 쓰지마 등)"
                className="min-h-[100px] resize-none"
                disabled={isRequestingFeedback}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">기타 참고사항</Label>
              <Textarea
                id="notes"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="참고할 만한 추가 정보나 특별한 요구사항이 있다면 입력해주세요."
                className="min-h-[80px] resize-none"
                disabled={isRequestingFeedback}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelFeedback}
              disabled={isRequestingFeedback}
            >
              취소
            </Button>
            <Button
              onClick={handleFeedbackSubmit}
              disabled={isRequestingFeedback || !feedbackText.trim()}
              className="flex items-center gap-2"
            >
              {isRequestingFeedback ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  처리 중...
                </>
              ) : (
                "다시 생성"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
