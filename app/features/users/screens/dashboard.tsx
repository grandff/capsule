import type { Route } from "./+types/dashboard";

import {
  ArrowRight,
  BarChart3,
  Heart,
  Target,
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
  // 샘플 데이터
  const trendingKeywords = [
    "AI",
    "메타버스",
    "NFT",
    "블록체인",
    "클라우드",
    "IoT",
  ];

  const currentChallenges = [
    { id: 1, title: "30일 글쓰기 챌린지", participants: 1250, daysLeft: 15 },
    { id: 2, title: "주간 창작 챌린지", participants: 890, daysLeft: 3 },
  ];

  const myChallenges = [
    {
      id: 1,
      title: "30일 글쓰기 챌린지",
      progress: 15,
      total: 30,
      status: "진행중",
    },
    {
      id: 2,
      title: "주간 창작 챌린지",
      progress: 5,
      total: 7,
      status: "진행중",
    },
  ];

  const writingStats = [
    { date: "2024-01-01", count: 3 },
    { date: "2024-01-02", count: 5 },
    { date: "2024-01-03", count: 2 },
    { date: "2024-01-04", count: 7 },
    { date: "2024-01-05", count: 4 },
    { date: "2024-01-06", count: 6 },
    { date: "2024-01-07", count: 3 },
  ];

  const socialStats = [
    {
      date: "2024-01-01",
      instagram: { likes: 120, followers: 1500 },
      twitter: { likes: 80, followers: 800 },
    },
    {
      date: "2024-01-02",
      instagram: { likes: 150, followers: 1520 },
      twitter: { likes: 95, followers: 820 },
    },
    {
      date: "2024-01-03",
      instagram: { likes: 130, followers: 1540 },
      twitter: { likes: 110, followers: 850 },
    },
    {
      date: "2024-01-04",
      instagram: { likes: 180, followers: 1570 },
      twitter: { likes: 125, followers: 880 },
    },
    {
      date: "2024-01-05",
      instagram: { likes: 200, followers: 1600 },
      twitter: { likes: 140, followers: 920 },
    },
    {
      date: "2024-01-06",
      instagram: { likes: 220, followers: 1630 },
      twitter: { likes: 160, followers: 950 },
    },
    {
      date: "2024-01-07",
      instagram: { likes: 250, followers: 1660 },
      twitter: { likes: 180, followers: 980 },
    },
  ];

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

        {/* 2. 오늘의 트렌드 */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              오늘의 트렌드
            </CardTitle>
            <Link to="/dashboard/trend">
              <Button variant="ghost" size="sm">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="flex flex-wrap gap-2">
              {trendingKeywords.map((keyword, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  #{keyword}
                </Badge>
              ))}
            </div>
            <p className="text-muted-foreground mt-3 text-xs">
              최근 24시간 동안 가장 많이 언급된 키워드입니다
            </p>
          </CardContent>
        </Card>

        {/* 3. 챌린지 정보 */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              챌린지 현황
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="grid grid-cols-2 gap-4">
              {/* 현재 진행중인 챌린지 */}
              <div>
                <h4 className="mb-2 text-sm font-semibold">진행중인 챌린지</h4>
                <div className="space-y-2">
                  {currentChallenges.map((challenge) => (
                    <div key={challenge.id} className="text-xs">
                      <p className="truncate font-medium">{challenge.title}</p>
                      <p className="text-muted-foreground">
                        {challenge.participants.toLocaleString()}명 참여
                      </p>
                      <p className="text-muted-foreground">
                        {challenge.daysLeft}일 남음
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 내가 참여한 챌린지 */}
              <div>
                <h4 className="mb-2 text-sm font-semibold">내 챌린지</h4>
                <div className="space-y-2">
                  {myChallenges.map((challenge) => (
                    <div key={challenge.id} className="text-xs">
                      <p className="truncate font-medium">{challenge.title}</p>
                      <div className="flex items-center gap-1">
                        <div className="h-1 flex-1 rounded-full bg-gray-200">
                          <div
                            className="h-1 rounded-full bg-blue-600"
                            style={{
                              width: `${(challenge.progress / challenge.total) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-muted-foreground">
                          {challenge.progress}/{challenge.total}
                        </span>
                      </div>
                      <p className="text-muted-foreground">
                        {challenge.status}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 두 번째 줄 - 1개 영역 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              일별 글 작성 현황
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {writingStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">
                    {new Date(stat.date).toLocaleDateString("ko-KR", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-20 rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-blue-600"
                        style={{ width: `${(stat.count / 10) * 100}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-sm font-medium">
                      {stat.count}개
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Heart className="h-5 w-5" />
                <Users className="h-5 w-5" />
              </div>
              SNS 성과 분석
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Instagram */}
              <div>
                <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <div className="h-3 w-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                  Instagram
                </h4>
                <div className="space-y-2">
                  {socialStats.slice(-3).map((stat, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-xs"
                    >
                      <span>
                        {new Date(stat.date).toLocaleDateString("ko-KR", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <div className="flex items-center gap-4">
                        <span className="text-red-500">
                          ♥ {stat.instagram.likes}
                        </span>
                        <span className="text-blue-500">
                          👥 {stat.instagram.followers}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Twitter */}
              <div>
                <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  Twitter
                </h4>
                <div className="space-y-2">
                  {socialStats.slice(-3).map((stat, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-xs"
                    >
                      <span>
                        {new Date(stat.date).toLocaleDateString("ko-KR", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <div className="flex items-center gap-4">
                        <span className="text-red-500">
                          ♥ {stat.twitter.likes}
                        </span>
                        <span className="text-blue-500">
                          👥 {stat.twitter.followers}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
