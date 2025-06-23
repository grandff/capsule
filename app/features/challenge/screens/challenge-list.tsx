import {
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Search,
  Star,
  Target,
  TrendingUp,
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
import { Input } from "~/core/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/core/components/ui/select";

export default function ChallengeList() {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");

  // 상태 옵션
  const statusOptions = [
    { value: "all", label: "전체" },
    { value: "active", label: "진행중" },
    { value: "ended", label: "종료" },
  ];

  // 챌린지 데이터
  const challenges = [
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
      status: "active",
      difficulty: "중급",
      category: "스토리텔링",
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
      status: "ended",
      difficulty: "고급",
      category: "소셜미디어",
      tags: ["인플루언서", "소셜미디어", "팔로워"],
    },
    {
      id: 5,
      title: "데이터 기반 마케팅",
      description:
        "데이터를 활용한 효과적인 마케팅 전략을 수립하는 챌린지입니다.",
      icon: "📊",
      lucideIcon: TrendingUp,
      participants: 750,
      maxParticipants: 1000,
      startDate: new Date("2024-01-20"),
      endDate: new Date("2024-02-20"),
      status: "active",
      difficulty: "고급",
      category: "마케팅",
      tags: ["데이터", "마케팅", "분석"],
    },
    {
      id: 6,
      title: "창업 아이디어 발굴",
      description:
        "창업 아이디어를 발굴하고 검증하는 과정을 체험하는 챌린지입니다.",
      icon: "💡",
      lucideIcon: Star,
      participants: 450,
      maxParticipants: 600,
      startDate: new Date("2024-01-25"),
      endDate: new Date("2024-02-25"),
      status: "active",
      difficulty: "초급",
      category: "창업",
      tags: ["창업", "아이디어", "검증"],
    },
  ];

  // 필터링된 챌린지 목록
  const filteredChallenges = challenges.filter((challenge) => {
    // 상태 필터
    if (statusFilter !== "all" && challenge.status !== statusFilter) {
      return false;
    }

    // 검색 필터
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      const searchText =
        `${challenge.title} ${challenge.description} ${challenge.tags.join(" ")}`.toLowerCase();
      return searchText.includes(keyword);
    }

    return true;
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
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
      case "ended":
        return <Badge variant="secondary">종료</Badge>;
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

  const getProgressPercentage = (
    participants: number,
    maxParticipants: number,
  ) => {
    return Math.min((participants / maxParticipants) * 100, 100);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">챌린지 목록</h1>
          <p className="text-muted-foreground">
            다양한 챌린지에 참여하여 실력을 키워보세요
          </p>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="챌린지 검색..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
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

      {/* 챌린지 목록 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredChallenges.map((challenge) => {
          const IconComponent = challenge.lucideIcon;
          return (
            <Card
              key={challenge.id}
              className="cursor-pointer transition-shadow hover:shadow-lg"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-purple-100">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {challenge.title}
                      </CardTitle>
                      <div className="mt-2 flex items-center gap-2">
                        {getStatusBadge(challenge.status)}
                        {getDifficultyBadge(challenge.difficulty)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground line-clamp-2 text-sm">
                  {challenge.description}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <div className="text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {formatDate(challenge.startDate)} ~{" "}
                      {formatDate(challenge.endDate)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-muted-foreground flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>참여자</span>
                    </div>
                    <span className="font-medium">
                      {challenge.participants.toLocaleString()}/
                      {challenge.maxParticipants.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                      style={{
                        width: `${getProgressPercentage(challenge.participants, challenge.maxParticipants)}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {challenge.tags.map((tag, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() =>
                    navigate(`/dashboard/challenge/${challenge.id}`)
                  }
                >
                  상세보기
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 결과 없음 */}
      {filteredChallenges.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Search className="text-muted-foreground mb-4 h-12 w-12" />
          <h3 className="mb-2 text-lg font-semibold">검색 결과가 없습니다</h3>
          <p className="text-muted-foreground">
            다른 키워드로 검색하거나 필터를 조정해보세요.
          </p>
        </div>
      )}
    </div>
  );
}
