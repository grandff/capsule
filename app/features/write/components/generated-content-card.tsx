import { CheckCircle2Icon, Copy, FileText, X } from "lucide-react";

import { Button } from "~/core/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";
import { Textarea } from "~/core/components/ui/textarea";

interface GeneratedContentCardProps {
  content: string;
  isEditing: boolean;
  editedContent: string;
  isCopied: boolean;
  onToggleEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onCopy: () => void;
  onEditedContentChange: (content: string) => void;
}

export function GeneratedContentCard({
  content,
  isEditing,
  editedContent,
  isCopied,
  onToggleEdit,
  onSaveEdit,
  onCancelEdit,
  onCopy,
  onEditedContentChange,
}: GeneratedContentCardProps) {
  const displayContent = isEditing ? editedContent : content;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">생성된 홍보글</CardTitle>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <>
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
  );
}
