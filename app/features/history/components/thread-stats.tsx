import {
  BarChart3,
  Heart,
  MessageCircle,
  Play,
  RefreshCw,
  Repeat,
  Users,
} from "lucide-react";

import { Button } from "~/core/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/core/components/ui/tooltip";

interface ThreadStatsProps {
  thread: any;
  followerChange?: {
    currentFollowers: number;
    baselineFollowers: number;
    followerChange: number;
    isPositive: boolean;
    isNegative: boolean;
    isNeutral: boolean;
  } | null;
  onUpdateInsights: () => Promise<void>;
  isUpdating: boolean;
}

export function ThreadStats({
  thread,
  followerChange,
  onUpdateInsights,
  isUpdating,
}: ThreadStatsProps) {
  const isDeleted = thread.result_id === "DELETED";
  const isDisabled = isUpdating || isDeleted;

  return (
    <Card className="dark:border-gray-700 dark:bg-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 dark:text-gray-200">
            <BarChart3 className="h-5 w-5" />
            성과 통계
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onUpdateInsights}
                  disabled={isDisabled}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isUpdating ? "animate-spin" : ""}`}
                  />
                  {isUpdating ? "업데이트 중..." : "새로고침"}
                </Button>
              </TooltipTrigger>
              {isDeleted && (
                <TooltipContent>
                  <p>삭제된 게시글은 인사이트를 업데이트할 수 없습니다.</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-blue-50 p-4 text-center dark:bg-blue-900/20">
            <Play className="mx-auto mb-2 h-8 w-8 text-blue-500" />
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {thread.view_cnt.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">재생</div>
          </div>
          <div className="rounded-lg bg-red-50 p-4 text-center dark:bg-red-900/20">
            <Heart className="mx-auto mb-2 h-8 w-8 text-red-500" />
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {thread.like_cnt.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              좋아요
            </div>
          </div>
          <div className="rounded-lg bg-green-50 p-4 text-center dark:bg-green-900/20">
            <MessageCircle className="mx-auto mb-2 h-8 w-8 text-green-500" />
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {thread.comment_cnt.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">답글</div>
          </div>
          <div className="rounded-lg bg-purple-50 p-4 text-center dark:bg-purple-900/20">
            <Repeat className="mx-auto mb-2 h-8 w-8 text-purple-500" />
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {thread.share_cnt.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">공유</div>
          </div>
          <div className="rounded-lg bg-emerald-50 p-4 text-center dark:bg-emerald-900/20">
            <Users className="mx-auto mb-2 h-8 w-8 text-emerald-500" />
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {followerChange ? (
                <span
                  className={`${followerChange.isPositive ? "text-green-600 dark:text-green-400" : followerChange.isNegative ? "text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-400"}`}
                >
                  {followerChange.isPositive ? "+" : ""}
                  {followerChange.followerChange.toLocaleString()}
                </span>
              ) : (
                <span className="text-gray-600 dark:text-gray-400">-</span>
              )}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              팔로워 증감
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
