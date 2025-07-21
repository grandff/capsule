import {
  BarChart3,
  Heart,
  MessageCircle,
  Play,
  RefreshCw,
  Repeat,
  Users,
} from "lucide-react";
import { useFetcher } from "react-router";

import { Button } from "~/core/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";

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
  isUpdating?: boolean;
}

export function ThreadStats({
  thread,
  followerChange,
  isUpdating,
}: ThreadStatsProps) {
  return (
    <Card className="dark:border-gray-700 dark:bg-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 dark:text-gray-200">
            <BarChart3 className="h-5 w-5" />
            성과 통계
          </CardTitle>
          {/* fetcher.Form으로 Button을 감싼다 */}
          {/* <fetcher.Form method="post" action="/api/history/update-insights"> */}
          {/* <input type="hidden" name="threadId" value={thread.thread_id} /> */}
          <Button
            type="submit"
            size="sm"
            variant="outline"
            disabled={isUpdating}
            className="flex items-center gap-1"
          >
            <RefreshCw
              className={`h-4 w-4 ${isUpdating ? "animate-spin" : ""}`}
            />
            {isUpdating ? "새로고침 중..." : "새로고침"}
          </Button>
          {/* </fetcher.Form> */}
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
