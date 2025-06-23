import {
  BarChart3,
  Calendar,
  Clock,
  Eye,
  FileText,
  Filter,
  Hash,
  Heart,
  MessageCircle,
  Target,
  TrendingUp,
  UserCheck,
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

export default function TrendUser() {
  const [selectedInterest, setSelectedInterest] = useState("all");
  const [selectedIndustry, setSelectedIndustry] = useState("all");

  // 관심사 옵션
  const interestOptions = [
    { value: "all", label: "전체" },
    { value: "ai", label: "AI/기술" },
    { value: "startup", label: "스타트업" },
    { value: "marketing", label: "마케팅" },
    { value: "finance", label: "금융" },
    { value: "design", label: "디자인" },
  ];

  // 산업군 옵션
  const industryOptions = [
    { value: "all", label: "전체" },
    { value: "it", label: "IT/기술" },
    { value: "finance", label: "금융" },
    { value: "business", label: "비즈니스" },
    { value: "environment", label: "환경" },
    { value: "workplace", label: "직장" },
  ];

  // 유사 사용자 데이터
  const similarUsers = [
    {
      id: 1,
      name: "김개발",
      avatar: "/nft.jpg",
      followers: 12500,
      interests: ["AI", "스타트업", "기술"],
      industry: "IT/기술",
      recentPost: {
        title: "AI 기술로 스타트업 성장시키는 방법",
        content:
          "최근 AI 기술을 활용해서 우리 스타트업의 성장률을 300% 향상시켰습니다...",
        likes: 450,
        comments: 89,
        views: 3200,
        trendMatch: 92,
      },
      avgEngagement: 8.5,
    },
    {
      id: 2,
      name: "이창업",
      avatar: "/nft-2.jpg",
      followers: 8900,
      interests: ["스타트업", "투자", "마케팅"],
      industry: "비즈니스",
      recentPost: {
        title: "시리즈A 투자 유치 성공기",
        content:
          "6개월간의 준비 끝에 시리즈A 투자를 성공적으로 유치했습니다...",
        likes: 320,
        comments: 67,
        views: 2100,
        trendMatch: 88,
      },
      avgEngagement: 7.2,
    },
    {
      id: 3,
      name: "박마케터",
      avatar: "/nft.jpg",
      followers: 15600,
      interests: ["마케팅", "브랜딩", "AI"],
      industry: "비즈니스",
      recentPost: {
        title: "AI 마케팅으로 고객 전환율 2배 높이기",
        content:
          "AI 기반 개인화 마케팅을 도입한 결과 고객 전환율이 2배 향상되었습니다...",
        likes: 680,
        comments: 124,
        views: 4500,
        trendMatch: 95,
      },
      avgEngagement: 9.1,
    },
    {
      id: 4,
      name: "최디자이너",
      avatar: "/nft-2.jpg",
      followers: 7200,
      interests: ["디자인", "UX/UI", "기술"],
      industry: "IT/기술",
      recentPost: {
        title: "AI 시대의 UX 디자인 트렌드",
        content:
          "AI 기술이 발전하면서 UX 디자인도 큰 변화를 맞이하고 있습니다...",
        likes: 280,
        comments: 45,
        views: 1800,
        trendMatch: 85,
      },
      avgEngagement: 6.8,
    },
  ];

  // 인기 글 데이터
  const popularPosts = [
    {
      id: 1,
      author: "김개발",
      avatar: "/nft.jpg",
      title: "AI 기술로 스타트업 성장시키는 방법",
      content:
        "최근 AI 기술을 활용해서 우리 스타트업의 성장률을 300% 향상시켰습니다. 특히 고객 데이터 분석과 개인화 서비스에 AI를 적용한 결과가 놀라웠습니다...",
      keywords: ["AI", "스타트업", "성장", "데이터분석"],
      likes: 450,
      comments: 89,
      views: 3200,
      trendMatch: 92,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: 2,
      author: "박마케터",
      avatar: "/nft.jpg",
      title: "AI 마케팅으로 고객 전환율 2배 높이기",
      content:
        "AI 기반 개인화 마케팅을 도입한 결과 고객 전환율이 2배 향상되었습니다. 고객 행동 패턴을 분석하고 실시간으로 최적화하는 것이 핵심이었습니다...",
      keywords: ["AI", "마케팅", "개인화", "전환율"],
      likes: 680,
      comments: 124,
      views: 4500,
      trendMatch: 95,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: 3,
      author: "이창업",
      avatar: "/nft-2.jpg",
      title: "시리즈A 투자 유치 성공기",
      content:
        "6개월간의 준비 끝에 시리즈A 투자를 성공적으로 유치했습니다. 투자자들에게 어필한 핵심 포인트와 준비 과정을 공유합니다...",
      keywords: ["투자", "스타트업", "시리즈A", "성공기"],
      likes: 320,
      comments: 67,
      views: 2100,
      trendMatch: 88,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: 4,
      author: "최디자이너",
      avatar: "/nft-2.jpg",
      title: "AI 시대의 UX 디자인 트렌드",
      content:
        "AI 기술이 발전하면서 UX 디자인도 큰 변화를 맞이하고 있습니다. 개인화된 인터페이스와 예측 기반 디자인이 새로운 트렌드가 되고 있습니다...",
      keywords: ["UX", "AI", "디자인", "트렌드"],
      likes: 280,
      comments: 45,
      views: 1800,
      trendMatch: 85,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
    {
      id: 5,
      author: "김개발",
      avatar: "/nft.jpg",
      title: "블록체인 기술의 실제 활용 사례",
      content:
        "블록체인 기술을 실제 비즈니스에 적용한 사례를 공유합니다. 투명성과 보안성을 동시에 확보할 수 있는 방법을 알아보세요...",
      keywords: ["블록체인", "기술", "비즈니스", "보안"],
      likes: 390,
      comments: 78,
      views: 2800,
      trendMatch: 87,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  ];

  // 성공 패턴 데이터
  const successPatterns = {
    commonKeywords: ["AI", "스타트업", "성장", "기술", "마케팅", "투자"],
    optimalPostLength: "800-1200자",
    bestPostingTime: "오후 2-4시, 저녁 8-10시",
    topCategories: [
      { category: "기술 리뷰", engagement: 9.2 },
      { category: "성공 사례", engagement: 8.8 },
      { category: "트렌드 분석", engagement: 8.5 },
      { category: "팁/노하우", engagement: 8.1 },
    ],
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

  const formatFollowers = (followers: number) => {
    if (followers >= 10000) return `${(followers / 1000).toFixed(1)}K`;
    if (followers >= 1000) return `${(followers / 1000).toFixed(1)}K`;
    return followers.toString();
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">나와 비슷한 사람들</h1>
          <p className="text-muted-foreground">
            같은 관심사를 가진 사람들의 글과 반응을 확인해보세요
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedInterest} onValueChange={setSelectedInterest}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {interestOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {industryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 유사 사용자 카드 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            유사 사용자
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {similarUsers.map((user) => (
              <div
                key={user.id}
                className="rounded-lg border p-4 transition-shadow hover:shadow-md"
              >
                <div className="mb-3 flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-muted-foreground text-sm">
                      팔로워 {formatFollowers(user.followers)}
                    </p>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="mb-2 flex flex-wrap gap-1">
                    {user.interests.map((interest, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {user.industry}
                  </Badge>
                </div>

                <div className="mb-3">
                  <h4 className="mb-1 text-sm font-medium">
                    {user.recentPost.title}
                  </h4>
                  <p className="text-muted-foreground line-clamp-2 text-xs">
                    {user.recentPost.content}
                  </p>
                </div>

                <div className="text-muted-foreground flex items-center justify-between text-xs">
                  <span>평균 반응률 {user.avgEngagement}%</span>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>{user.recentPost.trendMatch}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 인기 글 분석 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            인기 글 분석
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {popularPosts.map((post) => (
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
                      <h3 className="font-semibold">{post.author}</h3>
                      <span className="text-muted-foreground text-xs">
                        {formatDate(post.createdAt)}
                      </span>
                    </div>

                    <h4 className="mb-2 font-medium">{post.title}</h4>
                    <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
                      {post.content}
                    </p>

                    <div className="mb-3 flex items-center gap-4 text-sm">
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
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-purple-500" />
                        <span>{post.trendMatch}%</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {post.keywords.map((keyword, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs"
                        >
                          #{keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 성공 패턴 분석 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            성공 패턴 분석
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* 공통 키워드 */}
            <div>
              <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Hash className="h-4 w-4" />
                공통 키워드
              </h4>
              <div className="flex flex-wrap gap-1">
                {successPatterns.commonKeywords.map((keyword, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>

            {/* 최적 글 길이 */}
            <div>
              <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <FileText className="h-4 w-4" />
                최적 글 길이
              </h4>
              <div className="text-lg font-bold text-blue-600">
                {successPatterns.optimalPostLength}
              </div>
              <p className="text-muted-foreground text-xs">
                가장 높은 반응률을 보이는 글 길이
              </p>
            </div>

            {/* 최적 작성 시간 */}
            <div>
              <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Clock className="h-4 w-4" />
                최적 작성 시간
              </h4>
              <div className="text-sm font-medium">
                {successPatterns.bestPostingTime}
              </div>
              <p className="text-muted-foreground text-xs">
                가장 높은 조회수를 기록하는 시간대
              </p>
            </div>

            {/* 인기 카테고리 */}
            <div>
              <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Target className="h-4 w-4" />
                인기 카테고리
              </h4>
              <div className="space-y-2">
                {successPatterns.topCategories.map((category, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm">{category.category}</span>
                    <span className="text-sm font-medium text-green-600">
                      {category.engagement}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
