import type { DailyStat } from "../utils/dashboard-utils";

import { Heart, MessageCircle, Play, Repeat } from "lucide-react";

import { Badge } from "~/core/components/ui/badge";

import { formatDate } from "../utils/dashboard-utils";

interface DailyStatsProps {
  dailyStats: DailyStat[];
}

export function DailyStats({ dailyStats }: DailyStatsProps) {
  if (dailyStats.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground dark:text-gray-400">
          아직 통계 데이터가 없습니다.
          <br />첫 번째 글을 작성해보세요!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {dailyStats.map((stat, index) => (
        <div key={index} className="rounded-lg border p-4 dark:border-gray-700">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium">{formatDate(stat.date)}</span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {stat.posts}개 글
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="flex items-center gap-1">
              <Play className="h-4 w-4 text-blue-500" />
              <span className="text-sm">
                {stat.total_views.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-sm">
                {stat.total_likes.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">
                {stat.total_comments.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Repeat className="h-4 w-4 text-purple-500" />
              <span className="text-sm">
                {stat.total_shares.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
