import {
  Award,
  BarChart3,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Pause,
  Play,
  Star,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

import { Badge } from "~/core/components/ui/badge";
import { Button } from "~/core/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";
import { Progress } from "~/core/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/core/components/ui/select";

export default function ChallengeMy() {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState("all");

  // 상태 옵션
  const statusOptions = [
    { value: "all", label: "전체" },
    { value: "active", label: "진행중" },
    { value: "completed", label: "완료" },
    { value: "paused", label: "일시정지" },
  ];

  // 내 챌린지 데이터
  const myChallenges = [
    {
      id: 1,
      title: "30일 브랜드 홍보 챌린지",
      description:
        "30일간 매일 브랜드 홍보글을 작성하여 브랜드 인지도를 높이는 챌린지입니다.",
      icon: "🎯",
      lucideIcon: Target,
      participants: 1250,
      maxParticipants: 2000,
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-01-31"),
      status: "active",
      difficulty: "초급",
      category: "브랜딩",
      currentDay: 15,
      totalDays: 30,
      completedDays: 14,
      missedDays: 1,
      averageScore: 87.5,
      lastSubmission: new Date("2024-01-15T10:30:00"),
      nextDeadline: new Date("2024-01-16T23:59:59"),
      tags: ["브랜드", "홍보", "마케팅"],
    },
    {
      id: 2,
      title: "AI 트렌드 분석 마스터",
      description:
        "AI 기술 트렌드를 분석하고 인사이트를 공유하는 21일 챌린지입니다.",
      icon: "🤖",
      lucideIcon: TrendingUp,
      participants: 890,
      maxParticipants: 1000,
      startDate: new Date("2024-01-15"),
      endDate: new Date("2024-02-05"),
      status: "active",
      difficulty: "중급",
      category: "기술",
      currentDay: 8,
      totalDays: 21,
      completedDays: 8,
      missedDays: 0,
      averageScore: 92.3,
      lastSubmission: new Date("2024-01-15T14:20:00"),
      nextDeadline: new Date("2024-01-16T23:59:59"),
      tags: ["AI", "트렌드", "분석"],
    },
    {
      id: 3,
      title: "스타트업 스토리텔링",
      description:
        "스타트업의 성공 스토리를 매력적으로 전달하는 방법을 배우는 챌린지입니다.",
      icon: "📚",
      lucideIcon: BookOpen,
      participants: 650,
      maxParticipants: 800,
      startDate: new Date("2024-01-10"),
      endDate: new Date("2024-02-10"),
      status: "paused",
      difficulty: "중급",
      category: "스토리텔링",
      currentDay: 12,
      totalDays: 30,
      completedDays: 8,
      missedDays: 4,
      averageScore: 78.9,
      lastSubmission: new Date("2024-01-12T09:15:00"),
      nextDeadline: new Date("2024-01-16T23:59:59"),
      tags: ["스타트업", "스토리", "성공"],
    },
    {
      id: 4,
      title: "소셜미디어 인플루언서",
      description:
        "소셜미디어에서 영향력을 키우는 방법을 실습하는 14일 챌린지입니다.",
      icon: "⚡",
      lucideIcon: Zap,
      participants: 2100,
      maxParticipants: 2500,
      startDate: new Date("2024-01-05"),
      endDate: new Date("2024-01-19"),
      status: "completed",
      difficulty: "고급",
      category: "소셜미디어",
      currentDay: 14,
      totalDays: 14,
      completedDays: 14,
      missedDays: 0,
      averageScore: 94.2,
      lastSubmission: new Date("2024-01-19T16:45:00"),
      nextDeadline: null,
      tags: ["인플루언서", "소셜미디어", "팔로워"],
    },
  ];

  // 필터링된 챌린지 목록
  const filteredChallenges = myChallenges.filter((challenge) => {
    if (selectedStatus !== "all" && challenge.status !== selectedStatus) {
      return false;
    }
    return true;
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            진행중
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            완료
          </Badge>
        );
      case "paused":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            일시정지
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "초급":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            초급
          </Badge>
        );
      case "중급":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            중급
          </Badge>
        );
      case "고급":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            고급
          </Badge>
        );
      default:
        return <Badge variant="outline">{difficulty}</Badge>;
    }
  };

  const getProgressPercentage = (completedDays: number, totalDays: number) => {
    return (completedDays / totalDays) * 100;
  };

  const getTimeRemaining = (deadline: Date) => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}일 남음`;
    } else if (hours > 0) {
      return `${hours}시간 ${minutes}분 남음`;
    } else if (minutes > 0) {
      return `${minutes}분 남음`;
    } else {
      return "마감됨";
    }
  };

  const getStreakStatus = (missedDays: number) => {
    if (missedDays === 0) {
      return (
        <div className="flex items-center gap-1 text-green-600">
          <CheckCircle className="h-4 w-4" /> 연속 참여
        </div>
      );
    } else if (missedDays === 1) {
      return (
        <div className="flex items-center gap-1 text-yellow-600">
          <Clock className="h-4 w-4" /> 1일 건너뜀
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1 text-red-600">
          <XCircle className="h-4 w-4" /> {missedDays}일 건너뜀
        </div>
      );
    }
  };

  const IconComponent = (challenge: any) => challenge.lucideIcon;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">내 챌린지</h1>
          <p className="text-muted-foreground">
            참여 중인 챌린지와 진행 상황을 확인하세요
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 통계 요약 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Play className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">진행중</p>
                <p className="text-2xl font-bold">
                  {myChallenges.filter((c) => c.status === "active").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">완료</p>
                <p className="text-2xl font-bold">
                  {myChallenges.filter((c) => c.status === "completed").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <Trophy className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">평균 점수</p>
                <p className="text-2xl font-bold">
                  {Math.round(
                    myChallenges.reduce((acc, c) => acc + c.averageScore, 0) /
                      myChallenges.length,
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                <Award className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">총 참여일</p>
                <p className="text-2xl font-bold">
                  {myChallenges.reduce((acc, c) => acc + c.completedDays, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 챌린지 목록 */}
      <div className="space-y-6">
        {filteredChallenges.map((challenge) => {
          const IconComponent = challenge.lucideIcon;
          return (
            <Card
              key={challenge.id}
              className="transition-shadow hover:shadow-lg"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-purple-100">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">
                        {challenge.title}
                      </CardTitle>
                      <div className="mt-2 flex items-center gap-2">
                        {getStatusBadge(challenge.status)}
                        {getDifficultyBadge(challenge.difficulty)}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    상세보기
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  {/* 진행 상황 */}
                  <div className="space-y-4">
                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span>진행률</span>
                        <span className="font-medium">
                          {challenge.completedDays}/{challenge.totalDays}일
                        </span>
                      </div>
                      <Progress
                        value={getProgressPercentage(
                          challenge.completedDays,
                          challenge.totalDays,
                        )}
                        className="h-2"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">완료일</p>
                        <p className="font-medium">
                          {challenge.completedDays}일
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">건너뛴 일</p>
                        <p className="font-medium">{challenge.missedDays}일</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">
                        참여 상태
                      </span>
                      {getStreakStatus(challenge.missedDays)}
                    </div>
                  </div>

                  {/* 성과 분석 */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold">성과 분석</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm">
                          평균 점수
                        </span>
                        <span className="text-lg font-medium">
                          {challenge.averageScore}점
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm">
                          마지막 제출
                        </span>
                        <span className="text-sm">
                          {formatDateTime(challenge.lastSubmission)}
                        </span>
                      </div>
                      {challenge.nextDeadline && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-sm">
                            다음 마감
                          </span>
                          <span className="text-sm font-medium text-red-600">
                            {getTimeRemaining(challenge.nextDeadline)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold">액션</h4>
                    <div className="space-y-2">
                      <Button
                        className="w-full"
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          navigate(`/dashboard/challenge/${challenge.id}`)
                        }
                      >
                        상세보기
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 결과 없음 */}
      {filteredChallenges.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Trophy className="text-muted-foreground mb-4 h-12 w-12" />
          <h3 className="mb-2 text-lg font-semibold">
            참여 중인 챌린지가 없습니다
          </h3>
          <p className="text-muted-foreground">
            새로운 챌린지에 참여하여 실력을 키워보세요.
          </p>
          <Button className="mt-4">챌린지 둘러보기</Button>
        </div>
      )}
    </div>
  );
}
