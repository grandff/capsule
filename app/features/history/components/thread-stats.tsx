import {
  BarChart3,
  Heart,
  MessageCircle,
  Play,
  RefreshCw,
  Repeat,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

import { STATS_REFRESH_COOLDOWN } from "~/constants";
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
  onRefresh?: () => void;
}

export function ThreadStats({
  thread,
  followerChange,
  isUpdating,
  onRefresh,
}: ThreadStatsProps) {
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [isInCooldown, setIsInCooldown] = useState(false);
  const [hasRefreshed, setHasRefreshed] = useState(false);

  // 쿨다운 타이머
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isInCooldown && cooldownSeconds > 0) {
      interval = setInterval(() => {
        setCooldownSeconds((prev) => {
          if (prev <= 1) {
            setIsInCooldown(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isInCooldown, cooldownSeconds]);

  // isUpdating이 false로 변경되고 이전에 새로고침을 했었다면 쿨다운 시작
  useEffect(() => {
    if (!isUpdating && hasRefreshed) {
      // 업데이트가 완료되면 쿨다운 시작
      setIsInCooldown(true);
      setCooldownSeconds(STATS_REFRESH_COOLDOWN);
      setHasRefreshed(false); // 리셋
    }
  }, [isUpdating, hasRefreshed]);

  // 새로고침 핸들러
  const handleRefresh = () => {
    if (!isInCooldown && !isUpdating && onRefresh) {
      setHasRefreshed(true); // 새로고침 시작 표시
      onRefresh();
    }
  };

  // 버튼 비활성화 여부
  const isDisabled = isUpdating || isInCooldown;

  // 버튼 텍스트
  const getButtonText = () => {
    if (isUpdating) return "새로고침 중...";
    if (isInCooldown) return `${cooldownSeconds}초 후 가능`;
    return "새로고침";
  };

  return (
    <Card className="dark:border-gray-700 dark:bg-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 dark:text-gray-200">
            <BarChart3 className="h-5 w-5" />
            성과 통계
          </CardTitle>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={isDisabled}
            onClick={handleRefresh}
            className="flex items-center gap-1"
          >
            <RefreshCw
              className={`h-4 w-4 ${isUpdating ? "animate-spin" : ""}`}
            />
            {getButtonText()}
          </Button>
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
