import type { Route } from "./+types/dashboard";

import { NumberTicker } from "components/magicui/number-ticker";
import {
  ArrowRight,
  BarChart3,
  Clock,
  Construction,
  Heart,
  MessageCircle,
  Repeat,
  Share2,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { Link } from "react-router";

import { Badge } from "~/core/components/ui/badge";
import { Button } from "~/core/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";

export const meta: Route.MetaFunction = () => {
  return [{ title: `Dashboard | ${import.meta.env.VITE_APP_NAME}` }];
};

export default function Dashboard({ loaderData }: { loaderData: any }) {
  // 통계 데이터가 없으면 기본값 사용
  const averages = loaderData?.dashboardStats?.averages || {
    posts: 0,
    likes: 0,
    shares: 0,
    comments: 0,
    views: 0,
    followers: 0,
  };

  const dailyStats = loaderData?.dashboardStats?.dailyStats || [];

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* 첫 번째 줄 - 3개 영역 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* 1. 새로운 글 작성 */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              새로운 글 작성
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-between">
            <p className="text-muted-foreground mb-4">
              오늘의 이야기를 작성하고 트렌드에 맞는 홍보글을 만들어보세요!
            </p>
            <Link to="/dashboard/write/today">
              <Button className="w-full">글 작성하기</Button>
            </Link>
          </CardContent>
        </Card>

        {/* 2. 오늘의 트렌드 - 준비 중 */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              오늘의 트렌드
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col items-center justify-center">
            <Construction className="text-muted-foreground mb-4 h-12 w-12" />
            <p className="text-muted-foreground text-center text-sm">
              트렌드 분석 기능이
              <br />
              준비 중입니다
            </p>
          </CardContent>
        </Card>

        {/* 3. 챌린지 현황 - 준비 중 */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              챌린지 현황
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col items-center justify-center">
            <Clock className="text-muted-foreground mb-4 h-12 w-12" />
            <p className="text-muted-foreground text-center text-sm">
              챌린지 기능이
              <br />
              준비 중입니다
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 두 번째 줄 - 통합 통계 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            일별 통합 성과 분석
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 평균값 요약 */}
            <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4 md:grid-cols-5 dark:bg-gray-800">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  <NumberTicker
                    className="text-lg font-bold text-blue-600 dark:text-blue-400"
                    value={averages.posts}
                  />{" "}
                  개
                </div>
                <div className="text-muted-foreground text-xs">평균 글 수</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-red-600 dark:text-red-400">
                  <NumberTicker
                    className="text-lg font-bold text-red-600 dark:text-red-400"
                    value={averages.likes}
                  />
                </div>
                <div className="text-muted-foreground text-xs">평균 좋아요</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  <NumberTicker
                    className="text-lg font-bold text-green-600 dark:text-green-400"
                    value={averages.followers}
                  />{" "}
                  +
                </div>
                <div className="text-muted-foreground text-xs">
                  평균 팔로워 증가
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  <NumberTicker
                    className="text-lg font-bold text-purple-600 dark:text-purple-400"
                    value={averages.shares}
                  />
                </div>
                <div className="text-muted-foreground text-xs">평균 공유</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                  <NumberTicker
                    className="text-lg font-bold text-orange-600 dark:text-orange-400"
                    value={averages.comments}
                  />
                </div>
                <div className="text-muted-foreground text-xs">평균 답글</div>
              </div>
            </div>

            {/* 일별 상세 통계 */}
            <div className="space-y-3">
              {dailyStats.length > 0 ? (
                dailyStats.map((stat: any, index: number) => (
                  <div
                    key={index}
                    className="rounded-lg border p-4 dark:border-gray-700"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {new Date(stat.date).toLocaleDateString("ko-KR", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {stat.posts}개 글
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="text-sm">{stat.total_likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-green-500" />
                        <span className="text-sm">+{stat.total_followers}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600 dark:text-green-400">
                          {/* FIXME: 팔로워 증가율 계산을 위해서는 이전 날짜의 팔로워 수가 필요합니다 */}
                          N/A
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">{stat.total_shares}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Repeat className="h-4 w-4 text-orange-500" />
                        <span className="text-sm">{stat.total_comments}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">{stat.total_views}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground dark:text-gray-400">
                    아직 통계 데이터가 없습니다.
                    <br />첫 번째 글을 작성해보세요!
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
