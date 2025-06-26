import type { Route } from "./+types/dashboard";

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

export default function Dashboard() {
  // 통합 통계 데이터
  const integratedStats = [
    {
      date: "2024-01-01",
      posts: 3,
      totalLikes: 450,
      totalFollowers: 1500,
      followerGrowth: 25,
      followerGrowthRate: 1.67, // 전일대비 증감율 (%)
      totalShares: 12,
      totalReposts: 8,
    },
    {
      date: "2024-01-02",
      posts: 5,
      totalLikes: 680,
      totalFollowers: 1525,
      followerGrowth: 30,
      followerGrowthRate: 2.0,
      totalShares: 18,
      totalReposts: 15,
    },
    {
      date: "2024-01-03",
      posts: 2,
      totalLikes: 320,
      totalFollowers: 1540,
      followerGrowth: 15,
      followerGrowthRate: 0.98,
      totalShares: 8,
      totalReposts: 6,
    },
    {
      date: "2024-01-04",
      posts: 7,
      totalLikes: 890,
      totalFollowers: 1570,
      followerGrowth: 45,
      followerGrowthRate: 1.95,
      totalShares: 25,
      totalReposts: 22,
    },
    {
      date: "2024-01-05",
      posts: 4,
      totalLikes: 520,
      totalFollowers: 1600,
      followerGrowth: 30,
      followerGrowthRate: 1.91,
      totalShares: 15,
      totalReposts: 12,
    },
    {
      date: "2024-01-06",
      posts: 6,
      totalLikes: 750,
      totalFollowers: 1630,
      followerGrowth: 35,
      followerGrowthRate: 1.88,
      totalShares: 20,
      totalReposts: 18,
    },
    {
      date: "2024-01-07",
      posts: 3,
      totalLikes: 480,
      totalFollowers: 1660,
      followerGrowth: 30,
      followerGrowthRate: 1.84,
      totalShares: 12,
      totalReposts: 10,
    },
  ];

  // 평균값 계산
  const averages = {
    posts: Math.round(
      integratedStats.reduce((sum, stat) => sum + stat.posts, 0) /
        integratedStats.length,
    ),
    likes: Math.round(
      integratedStats.reduce((sum, stat) => sum + stat.totalLikes, 0) /
        integratedStats.length,
    ),
    followers: Math.round(
      integratedStats.reduce((sum, stat) => sum + stat.followerGrowth, 0) /
        integratedStats.length,
    ),
    shares: Math.round(
      integratedStats.reduce((sum, stat) => sum + stat.totalShares, 0) /
        integratedStats.length,
    ),
    reposts: Math.round(
      integratedStats.reduce((sum, stat) => sum + stat.totalReposts, 0) /
        integratedStats.length,
    ),
  };

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
                  {averages.posts}개
                </div>
                <div className="text-muted-foreground text-xs">평균 글 수</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-red-600 dark:text-red-400">
                  {averages.likes}
                </div>
                <div className="text-muted-foreground text-xs">평균 좋아요</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  +{averages.followers}
                </div>
                <div className="text-muted-foreground text-xs">
                  평균 팔로워 증가
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {averages.shares}
                </div>
                <div className="text-muted-foreground text-xs">평균 공유</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                  {averages.reposts}
                </div>
                <div className="text-muted-foreground text-xs">
                  평균 리포스트
                </div>
              </div>
            </div>

            {/* 일별 상세 통계 */}
            <div className="space-y-3">
              {integratedStats.map((stat, index) => (
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
                      <span className="text-sm">{stat.totalLikes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-green-500" />
                      <span className="text-sm">+{stat.followerGrowth}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {stat.followerGrowthRate >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <span
                        className={`text-sm ${stat.followerGrowthRate >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                      >
                        {stat.followerGrowthRate >= 0 ? "+" : ""}
                        {stat.followerGrowthRate}%
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Share2 className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">{stat.totalShares}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Repeat className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">{stat.totalReposts}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">{stat.totalFollowers}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
