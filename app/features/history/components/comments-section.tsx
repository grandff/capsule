import { Info, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { Alert, AlertDescription } from "~/core/components/ui/alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";

interface ThreadReply {
  id: string;
  text: string;
  timestamp: string;
  media_product_type: string;
  media_type: string;
  shortcode: string;
  has_replies: boolean;
  root_post: {
    id: string;
  };
  replied_to: {
    id: string;
  };
  is_reply: boolean;
  hide_status: "NOT_HUSHED" | "HIDDEN" | "UNHUSHED";
}

interface ThreadRepliesResponse {
  data: ThreadReply[];
  paging: {
    cursors: {
      before: string;
      after: string;
    };
  };
}

interface CommentsSectionProps {
  resultId: string | null;
}

export function CommentsSection({ resultId }: CommentsSectionProps) {
  const [replies, setReplies] = useState<ThreadRepliesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!resultId) {
      setReplies(null);
      return;
    }

    const fetchReplies = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/history/get-threads-replies/${resultId}`,
        );
        if (response.ok) {
          const data = await response.json();
          setReplies(data);
        } else {
          setError("답글을 불러오는데 실패했습니다.");
        }
      } catch (err) {
        console.error("Error fetching replies:", err);
        setError("답글을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReplies();
  }, [resultId]);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isHidden = (hideStatus: string) => {
    return hideStatus === "HIDDEN";
  };

  // 안전한 데이터 접근
  const repliesData = replies?.data || [];
  const repliesCount = repliesData.length;

  if (!resultId) {
    return (
      <Card className="dark:border-gray-700 dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 dark:text-gray-200">
            <MessageCircle className="h-5 w-5" />
            답글
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center dark:text-gray-400">
            답글 정보를 불러올 수 없습니다.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dark:border-gray-700 dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 dark:text-gray-200">
          <MessageCircle className="h-5 w-5" />
          답글 {repliesCount > 0 && `(${repliesCount}개)`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <p className="text-muted-foreground text-center dark:text-gray-400">
              답글을 불러오는 중...
            </p>
          ) : error ? (
            <p className="text-center text-red-600 dark:text-red-400">
              {error}
            </p>
          ) : repliesCount === 0 ? (
            <p className="text-muted-foreground text-center dark:text-gray-400">
              아직 답글이 없습니다.
            </p>
          ) : (
            <div className="space-y-4">
              {repliesData.map((reply) => (
                <div
                  key={reply.id}
                  className={`rounded-lg border p-4 ${
                    isHidden(reply.hide_status)
                      ? "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
                      : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p
                        className={`text-sm ${
                          isHidden(reply.hide_status)
                            ? "text-gray-500 dark:text-gray-400"
                            : "text-gray-900 dark:text-gray-100"
                        }`}
                      >
                        {isHidden(reply.hide_status)
                          ? "[숨겨진 답글]"
                          : reply.text}
                      </p>
                      <div className="mt-2 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>{formatDate(reply.timestamp)}</span>
                        {reply.has_replies && (
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            답글 있음
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
