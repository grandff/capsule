import {
  BarChart3,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  MessageSquare,
  Send,
  Star,
  Target,
  ThumbsUp,
  TrendingUp,
  Trophy,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/core/components/ui/avatar";
import { Badge } from "~/core/components/ui/badge";
import { Button } from "~/core/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";
import { Progress } from "~/core/components/ui/progress";
import { Textarea } from "~/core/components/ui/textarea";

export default function ChallengeDetail() {
  const { id } = useParams();
  const [submissionText, setSubmissionText] = useState("");
  const [isParticipating, setIsParticipating] = useState(false); // 실제로는 API에서 가져올 값

  // 챌린지 데이터 (실제로는 API에서 가져올 데이터)
  const challenges = [
    {
      id: 1,
      title: "30일 브랜드 홍보 챌린지",
      description:
        "30일간 매일 브랜드 홍보글을 작성하여 브랜드 인지도를 높이는 챌린지입니다. AI가 작성한 홍보글의 효과를 측정하고 개선점을 피드백해드립니다.",
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
      participationMethod:
        "매일 오늘의 주제에 맞는 브랜드 홍보글을 작성하고 제출하세요. AI가 글의 품질과 효과를 분석하여 점수와 피드백을 제공합니다.",
      currentDay: 15,
      totalDays: 30,
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
      participationMethod:
        "매일 AI 관련 트렌드를 분석하고 인사이트를 공유하세요. AI가 분석의 깊이와 정확성을 평가합니다.",
      currentDay: 8,
      totalDays: 21,
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
      participationMethod:
        "매일 스타트업 스토리를 작성하고 공유하세요. AI가 스토리의 매력도와 전달력을 평가합니다.",
      currentDay: 12,
      totalDays: 30,
    },
  ];

  // URL 파라미터로 챌린지 찾기
  const challenge =
    challenges.find((c) => c.id === parseInt(id || "1")) || challenges[0];

  // 오늘의 주제
  const todayTopic = {
    day: 15,
    title: "브랜드 스토리텔링",
    description:
      "오늘은 브랜드의 스토리를 매력적으로 전달하는 홍보글을 작성해보세요. 브랜드의 역사, 비전, 가치관을 포함하여 감정적으로 공감할 수 있는 내용으로 구성해보세요.",
    keywords: ["스토리텔링", "브랜드 히스토리", "감정적 연결", "비전"],
  };

  // 참여 내역 (참여 중일 때만 표시)
  const submissions = [
    {
      id: 1,
      day: 14,
      topic: "타겟 고객 분석",
      content:
        "우리 브랜드의 핵심 타겟은 20-30대 젊은 직장인들입니다. 이들은 시간에 민감하고 효율적인 솔루션을 원합니다. 따라서 우리 제품의 핵심 가치는 '시간 절약'과 '편의성'입니다...",
      submittedAt: new Date("2024-01-15T10:30:00"),
      score: 85,
      feedback:
        "타겟 고객 분석이 잘 되어 있습니다. 구체적인 데이터나 사례를 추가하면 더욱 설득력 있는 글이 될 것입니다.",
      aiAnalysis: {
        readability: 8.5,
        persuasiveness: 7.8,
        brandAlignment: 9.2,
        engagement: 8.1,
      },
    },
    {
      id: 2,
      day: 13,
      topic: "경쟁사 분석",
      content:
        "시장의 주요 경쟁사들과 비교했을 때 우리 브랜드의 차별화 포인트는 사용자 경험의 단순함입니다. 복잡한 기능보다는 직관적이고 빠른 사용성을 중시합니다...",
      submittedAt: new Date("2024-01-14T14:20:00"),
      score: 92,
      feedback:
        "경쟁사 대비 차별화 포인트가 명확하게 드러납니다. 구체적인 비교 사례가 있어서 더욱 설득력 있습니다.",
      aiAnalysis: {
        readability: 9.1,
        persuasiveness: 8.9,
        brandAlignment: 9.5,
        engagement: 8.7,
      },
    },
    {
      id: 3,
      day: 12,
      topic: "브랜드 메시지 전달",
      content:
        "우리 브랜드의 핵심 메시지는 '복잡함을 단순하게'입니다. 고객의 일상에서 마주하는 복잡한 문제들을 간단하고 효과적인 방법으로 해결해드립니다...",
      submittedAt: new Date("2024-01-13T09:15:00"),
      score: 78,
      feedback:
        "브랜드 메시지는 명확하지만, 구체적인 예시나 고객 후기를 추가하면 더욱 신뢰할 수 있는 글이 될 것입니다.",
      aiAnalysis: {
        readability: 7.8,
        persuasiveness: 7.2,
        brandAlignment: 8.5,
        engagement: 7.5,
      },
    },
  ];

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

  const getProgressPercentage = () => {
    return (challenge.currentDay / challenge.totalDays) * 100;
  };

  const handleSubmit = () => {
    if (submissionText.trim()) {
      // 제출 로직
      console.log("제출:", submissionText);
      setSubmissionText("");
      // 성공 메시지 표시
    }
  };

  const handleParticipate = () => {
    setIsParticipating(true);
    // 참여 로직
  };

  const IconComponent = challenge.lucideIcon;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* 상단 헤더 */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-purple-100">
            <IconComponent className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{challenge.title}</h1>
            <div className="mt-2 flex items-center gap-2">
              {getStatusBadge(challenge.status)}
              {getDifficultyBadge(challenge.difficulty)}
            </div>
          </div>
        </div>
        <Button
          onClick={handleParticipate}
          disabled={isParticipating}
          className={isParticipating ? "bg-gray-400" : ""}
        >
          {isParticipating ? "참여 중" : "참여하기"}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 왼쪽 컬럼 - 챌린지 정보 */}
        <div className="space-y-6 lg:col-span-2">
          {/* 챌린지 설명 */}
          <Card>
            <CardHeader>
              <CardTitle>챌린지 소개</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                {challenge.description}
              </p>

              <div className="space-y-3">
                <h4 className="font-semibold">참여 방법</h4>
                <p className="text-muted-foreground text-sm">
                  {challenge.participationMethod}
                </p>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>기간</span>
                </div>
                <span className="font-medium">
                  {formatDate(challenge.startDate)} ~{" "}
                  {formatDate(challenge.endDate)}
                </span>
              </div>

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

              <div className="flex flex-wrap gap-1">
                {challenge.tags.map((tag, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 오늘의 주제 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Day {todayTopic.day} - {todayTopic.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                {todayTopic.description}
              </p>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold">추천 키워드</h4>
                <div className="flex flex-wrap gap-1">
                  {todayTopic.keywords.map((keyword, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              {isParticipating && (
                <div className="space-y-3">
                  <Textarea
                    placeholder="오늘의 주제에 맞는 홍보글을 작성해주세요..."
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    className="min-h-[120px]"
                  />
                  <Button
                    onClick={handleSubmit}
                    disabled={!submissionText.trim()}
                    className="w-full"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    제출하기
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 참여 내역 (참여 중일 때만 표시) */}
          {isParticipating && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  참여 내역
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {submissions.map((submission) => (
                    <div key={submission.id} className="rounded-lg border p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="font-semibold">
                          Day {submission.day} - {submission.topic}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground text-sm">
                            {formatDate(submission.submittedAt)}
                          </span>
                          <Badge className="bg-blue-100 text-blue-800">
                            {submission.score}점
                          </Badge>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-3 line-clamp-3 text-sm">
                        {submission.content}
                      </p>

                      <div className="space-y-2">
                        <h5 className="text-sm font-medium">AI 분석 결과</h5>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span>가독성</span>
                            <span className="font-medium">
                              {submission.aiAnalysis.readability}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>설득력</span>
                            <span className="font-medium">
                              {submission.aiAnalysis.persuasiveness}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>브랜드 일치도</span>
                            <span className="font-medium">
                              {submission.aiAnalysis.brandAlignment}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>참여도</span>
                            <span className="font-medium">
                              {submission.aiAnalysis.engagement}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 rounded-lg bg-gray-50 p-3">
                        <h6 className="mb-1 text-sm font-medium">AI 피드백</h6>
                        <p className="text-muted-foreground text-sm">
                          {submission.feedback}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 오른쪽 컬럼 - 진행 상황 */}
        <div className="space-y-6">
          {/* 진행 상황 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                진행 상황
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>진행률</span>
                  <span className="font-medium">
                    {challenge.currentDay}/{challenge.totalDays}일
                  </span>
                </div>
                <Progress value={getProgressPercentage()} className="h-2" />
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">시작일</span>
                  <span>{formatDate(challenge.startDate)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">종료일</span>
                  <span>{formatDate(challenge.endDate)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">남은 일수</span>
                  <span className="font-medium text-blue-600">
                    {challenge.totalDays - challenge.currentDay}일
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 참여자 통계 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                참여자 현황
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>현재 참여자</span>
                  <span className="font-medium">
                    {challenge.participants.toLocaleString()}명
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>최대 참여자</span>
                  <span className="font-medium">
                    {challenge.maxParticipants.toLocaleString()}명
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                    style={{
                      width: `${(challenge.participants / challenge.maxParticipants) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="rounded-lg bg-blue-50 p-3">
                <div className="flex items-center gap-2 text-blue-800">
                  <Trophy className="h-4 w-4" />
                  <span className="text-sm font-medium">챌린지 완주 시</span>
                </div>
                <p className="mt-1 text-xs text-blue-600">
                  브랜드 홍보 전문가 인증서와 특별한 혜택을 제공합니다.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
