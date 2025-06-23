import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Calendar,
  Clock,
  Eye,
  Hash,
  Heart,
  MessageCircle,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/core/components/ui/select";

export default function TrendTopic() {
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  // 기간 옵션
  const periodOptions = [
    { value: "day", label: "일" },
    { value: "week", label: "주" },
    { value: "month", label: "월" },
    { value: "year", label: "연" },
  ];

  // 인기 토픽 데이터
  const trendingTopics = [
    {
      id: 1,
      topic: "AI 기술 발전",
      category: "기술",
      mentions: 15600,
      growth: 45.2,
      keywords: ["AI", "머신러닝", "딥러닝", "자연어처리"],
      trendData: [65, 72, 68, 85, 92, 88, 95],
    },
    {
      id: 2,
      topic: "메타버스 생태계",
      category: "기술",
      mentions: 12300,
      growth: 23.8,
      keywords: ["메타버스", "VR", "AR", "가상현실"],
      trendData: [45, 52, 48, 65, 72, 68, 75],
    },
    {
      id: 3,
      topic: "ESG 경영",
      category: "환경",
      mentions: 9800,
      growth: 67.8,
      keywords: ["ESG", "지속가능", "환경", "사회책임"],
      trendData: [35, 42, 58, 65, 72, 78, 85],
    },
    {
      id: 4,
      topic: "스타트업 투자",
      category: "금융",
      mentions: 8700,
      growth: 41.3,
      keywords: ["투자", "스타트업", "벤처캐피탈", "시리즈A"],
      trendData: [55, 62, 58, 75, 82, 78, 85],
    },
    {
      id: 5,
      topic: "원격근무 문화",
      category: "직장",
      mentions: 7200,
      growth: 12.3,
      keywords: ["원격근무", "재택근무", "워라밸", "직장문화"],
      trendData: [25, 32, 28, 35, 42, 38, 45],
    },
    {
      id: 6,
      topic: "블록체인 활용",
      category: "기술",
      mentions: 6800,
      growth: 18.9,
      keywords: ["블록체인", "암호화폐", "DeFi", "NFT"],
      trendData: [45, 42, 48, 55, 52, 58, 65],
    },
    {
      id: 7,
      topic: "개인정보 보호",
      category: "기술",
      mentions: 6200,
      growth: 34.6,
      keywords: ["개인정보", "데이터보호", "GDPR", "프라이버시"],
      trendData: [35, 42, 38, 45, 52, 48, 55],
    },
    {
      id: 8,
      topic: "마케팅 자동화",
      category: "비즈니스",
      mentions: 5800,
      growth: 26.9,
      keywords: ["마케팅", "자동화", "CRM", "고객관리"],
      trendData: [25, 32, 28, 35, 42, 38, 45],
    },
    {
      id: 9,
      topic: "클라우드 마이그레이션",
      category: "기술",
      mentions: 5400,
      growth: 32.1,
      keywords: ["클라우드", "AWS", "Azure", "마이그레이션"],
      trendData: [35, 42, 38, 45, 52, 48, 55],
    },
    {
      id: 10,
      topic: "디지털 전환",
      category: "비즈니스",
      mentions: 5100,
      growth: 28.4,
      keywords: ["디지털전환", "DX", "디지털화", "혁신"],
      trendData: [25, 32, 28, 35, 42, 38, 45],
    },
    {
      id: 11,
      topic: "IoT 생태계",
      category: "기술",
      mentions: 4800,
      growth: 15.7,
      keywords: ["IoT", "스마트홈", "센서", "연결성"],
      trendData: [35, 32, 38, 35, 42, 38, 45],
    },
    {
      id: 12,
      topic: "지속가능한 패션",
      category: "환경",
      mentions: 4500,
      growth: 55.4,
      keywords: ["패션", "지속가능", "친환경", "순환경제"],
      trendData: [25, 32, 38, 45, 52, 58, 65],
    },
    {
      id: 13,
      topic: "핀테크 혁신",
      category: "금융",
      mentions: 4200,
      growth: 38.5,
      keywords: ["핀테크", "금융기술", "모바일뱅킹", "결제"],
      trendData: [35, 42, 38, 45, 52, 48, 55],
    },
    {
      id: 14,
      topic: "UX/UI 디자인",
      category: "디자인",
      mentions: 3900,
      growth: 29.2,
      keywords: ["UX", "UI", "디자인", "사용자경험"],
      trendData: [25, 32, 28, 35, 42, 38, 45],
    },
    {
      id: 15,
      topic: "데이터 분석",
      category: "기술",
      mentions: 3600,
      growth: 47.1,
      keywords: ["데이터", "분석", "빅데이터", "인사이트"],
      trendData: [35, 42, 48, 55, 62, 58, 65],
    },
  ];

  // 대표 글 데이터
  const representativePosts = [
    {
      id: 1,
      topic: "AI 기술 발전",
      posts: [
        {
          id: 1,
          author: "김AI",
          avatar: "/nft.jpg",
          title: "2024년 AI 기술 트렌드와 미래 전망",
          content:
            "올해 AI 기술의 주요 발전 방향과 향후 5년간의 전망을 분석해보았습니다. 특히 생성형 AI와 자율주행 기술의 발전이 눈에 띄게 나타나고 있습니다...",
          likes: 1250,
          comments: 234,
          views: 8900,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
        {
          id: 2,
          author: "이테크",
          avatar: "/nft-2.jpg",
          title: "AI가 바꾸는 우리의 일상",
          content:
            "AI 기술이 어떻게 우리의 일상생활을 변화시키고 있는지 실제 사례를 통해 살펴보겠습니다. 개인비서부터 의료진단까지 다양한 분야에서 AI의 활용이 확대되고 있습니다...",
          likes: 890,
          comments: 156,
          views: 6700,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        },
      ],
    },
    {
      id: 2,
      topic: "ESG 경영",
      posts: [
        {
          id: 3,
          author: "박ESG",
          avatar: "/nft.jpg",
          title: "ESG 경영의 실제 성과 사례",
          content:
            "ESG 경영을 도입한 기업들의 실제 성과와 변화를 분석해보았습니다. 환경, 사회, 지배구조 측면에서의 개선 사례를 통해 ESG의 가치를 확인할 수 있습니다...",
          likes: 980,
          comments: 189,
          views: 7200,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
        {
          id: 4,
          author: "최지속",
          avatar: "/nft-2.jpg",
          title: "지속가능한 비즈니스 모델",
          content:
            "환경과 사회적 가치를 동시에 추구하는 지속가능한 비즈니스 모델의 사례를 소개합니다. 단순한 이익 추구를 넘어서 사회적 책임을 다하는 기업들의 이야기입니다...",
          likes: 750,
          comments: 134,
          views: 5800,
          createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        },
      ],
    },
    {
      id: 3,
      topic: "스타트업 투자",
      posts: [
        {
          id: 5,
          author: "김투자",
          avatar: "/nft.jpg",
          title: "2024년 스타트업 투자 트렌드",
          content:
            "올해 스타트업 투자 시장의 주요 변화와 트렌드를 분석해보았습니다. AI, 핀테크, 헬스케어 분야에서 특히 활발한 투자가 이루어지고 있습니다...",
          likes: 1100,
          comments: 201,
          views: 8100,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
        {
          id: 6,
          author: "이벤처",
          avatar: "/nft-2.jpg",
          title: "성공적인 투자 유치 전략",
          content:
            "스타트업이 성공적으로 투자를 유치하기 위한 전략과 준비사항을 정리해보았습니다. 투자자들이 주목하는 핵심 요소들과 피칭 노하우를 공유합니다...",
          likes: 820,
          comments: 145,
          views: 6300,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        },
      ],
    },
  ];

  const formatGrowth = (growth: number) => {
    const isPositive = growth >= 0;
    return (
      <div
        className={`flex items-center gap-1 ${isPositive ? "text-green-600" : "text-red-600"}`}
      >
        {isPositive ? (
          <ArrowUpRight className="h-3 w-3" />
        ) : (
          <ArrowDownRight className="h-3 w-3" />
        )}
        <span className="text-xs font-medium">
          {Math.abs(growth).toFixed(1)}%
        </span>
      </div>
    );
  };

  const formatMentions = (mentions: number) => {
    if (mentions >= 10000) return `${(mentions / 1000).toFixed(1)}K`;
    if (mentions >= 1000) return `${(mentions / 1000).toFixed(1)}K`;
    return mentions.toString();
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 24) return `${diffInHours}시간 전`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}일 전`;
  };

  // 미니 차트 컴포넌트
  const MiniChart = ({ data }: { data: number[] }) => {
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue;

    return (
      <div className="flex h-8 items-end gap-0.5">
        {data.map((value, index) => {
          const height = range > 0 ? ((value - minValue) / range) * 100 : 50;
          return (
            <div
              key={index}
              className="w-1 rounded-sm bg-blue-500"
              style={{ height: `${height}%` }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">인기 토픽</h1>
          <p className="text-muted-foreground">
            가장 많이 언급되고 있는 주제들을 확인해보세요
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 인기 토픽 차트 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              인기 토픽 TOP 15
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trendingTopics.map((topic, index) => (
                <div
                  key={topic.id}
                  className="rounded-lg border p-3 transition-shadow hover:shadow-md"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-sm font-medium text-gray-500">
                        #{index + 1}
                      </span>
                      <div>
                        <h3 className="text-sm font-semibold">{topic.topic}</h3>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {topic.category}
                          </Badge>
                          <span className="text-muted-foreground text-xs">
                            {formatMentions(topic.mentions)}회 언급
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {formatGrowth(topic.growth)}
                      <MiniChart data={topic.trendData} />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {topic.keywords.map((keyword, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        #{keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 대표 글 목록 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              대표 글 목록
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {representativePosts.map((topicGroup) => (
                <div key={topicGroup.id}>
                  <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                    <Hash className="h-4 w-4" />
                    {topicGroup.topic}
                  </h3>
                  <div className="space-y-4">
                    {topicGroup.posts.map((post) => (
                      <div
                        key={post.id}
                        className="rounded-lg border p-4 transition-shadow hover:shadow-md"
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={post.avatar} />
                            <AvatarFallback>{post.author[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="mb-2 flex items-center gap-2">
                              <h4 className="font-semibold">{post.author}</h4>
                              <span className="text-muted-foreground text-xs">
                                {formatDate(post.createdAt)}
                              </span>
                            </div>

                            <h5 className="mb-2 font-medium">{post.title}</h5>
                            <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
                              {post.content}
                            </p>

                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Heart className="h-4 w-4 text-red-500" />
                                <span>{post.likes.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageCircle className="h-4 w-4 text-blue-500" />
                                <span>{post.comments.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4 text-green-500" />
                                <span>{post.views.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
