import {
  ArrowLeft,
  BarChart3,
  Calendar,
  Eye,
  Heart,
  Info,
  MessageCircle,
  Play,
  Quote,
  Repeat,
  Share2,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import { Alert, AlertDescription } from "~/core/components/ui/alert";
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

export default function HistoryDetail() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 샘플 데이터 생성
  const generateSamplePost = (postId: string) => {
    const moods = ["친근한", "전문적인", "재미있는", "감성적인", "신뢰감 있는"];
    const keywords = [
      "AI",
      "메타버스",
      "NFT",
      "블록체인",
      "클라우드",
      "IoT",
      "스타트업",
      "창업",
    ];

    return {
      id: postId,
      content: `오늘은 정말 특별한 하루였습니다. 새로운 기술을 배우면서 많은 것을 깨달았고, 팀원들과 함께 프로젝트를 진행하면서 협업의 중요성을 다시 한번 느꼈습니다. 특히 AI 기술의 발전 속도가 놀라워서, 앞으로의 변화가 기대됩니다.

팀 프로젝트를 진행하면서 가장 인상 깊었던 것은 서로 다른 배경을 가진 팀원들이 각자의 강점을 발휘하며 시너지를 만들어내는 모습이었습니다. 개발자는 기술적 구현에 집중하고, 디자이너는 사용자 경험을 고려하며, 기획자는 비즈니스 관점에서 접근하는 모습이 정말 아름다웠습니다.

이번 프로젝트를 통해 협업의 중요성과 팀워크의 가치를 다시 한번 깨달았습니다. 혼자서는 할 수 없는 일들을 함께하면 훨씬 더 큰 가치를 만들어낼 수 있다는 것을 실감했습니다. 앞으로도 이런 경험들을 통해 계속 성장하고 싶습니다.`,
      createdAt: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
      ),
      // 쓰레드 지표
      views: Math.floor(Math.random() * 5000) + 200,
      likes: Math.floor(Math.random() * 1000) + 50,
      replies: Math.floor(Math.random() * 100) + 5,
      reposts: Math.floor(Math.random() * 200) + 10,
      quotes: Math.floor(Math.random() * 50) + 2,
      shares: Math.floor(Math.random() * 30) + 1,
      followers: Math.floor(Math.random() * 500) + 20,
      moods: moods.slice(0, Math.floor(Math.random() * 3) + 1),
      keywords: keywords.slice(0, Math.floor(Math.random() * 4) + 2),
      industry: ["IT/기술", "금융", "의료", "교육", "엔터테인먼트"][
        Math.floor(Math.random() * 5)
      ],
      tone: ["공식적", "친근함", "유머러스", "감성적", "전문적"][
        Math.floor(Math.random() * 5)
      ],
      commentsList: [
        {
          id: 1,
          author: "김철수",
          avatar: "/nft.jpg",
          content:
            "정말 공감되는 내용이네요! 협업의 중요성을 잘 표현하셨습니다.",
          createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
          likes: Math.floor(Math.random() * 50) + 5,
        },
        {
          id: 2,
          author: "이영희",
          avatar: "/nft-2.jpg",
          content:
            "AI 기술 발전 속도가 정말 놀랍죠. 앞으로 어떤 변화가 있을지 기대됩니다.",
          createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
          likes: Math.floor(Math.random() * 50) + 5,
        },
        {
          id: 3,
          author: "박민수",
          avatar: "/nft.jpg",
          content:
            "팀워크의 중요성을 잘 설명해주셨네요. 저도 비슷한 경험이 있어서 더욱 공감됩니다.",
          createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
          likes: Math.floor(Math.random() * 50) + 5,
        },
      ],
      // 트렌드 분석 주석 처리
      /*
      trendAnalysis: {
        currentTrends: ["AI", "협업", "팀워크", "기술발전", "창업"],
        matchedKeywords: ["AI", "협업", "팀워크"],
        trendScore: 85,
        recommendations: [
          "AI 관련 키워드를 더 추가하면 트렌드 매칭도가 높아질 수 있습니다",
          "최신 기술 트렌드와 연관된 내용을 추가해보세요",
          "해시태그를 활용하여 검색 노출을 높여보세요",
        ],
      },
      */
    };
  };

  useEffect(() => {
    // 실제 API 호출을 시뮬레이션
    const loadPost = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const postData = generateSamplePost(id || "1");
      setPost(postData);
      setLoading(false);
    };

    loadPost();
  }, [id]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "방금 전";
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}일 전`;
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground dark:text-gray-400">
          글을 찾을 수 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* 뒤로가기 버튼 */}
      <div className="flex items-center gap-4">
        <Link to="/dashboard/history">
          <Button
            variant="ghost"
            size="sm"
            className="dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            목록으로
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 메인 콘텐츠 */}
        <div className="space-y-6 lg:col-span-2">
          {/* 글 내용 */}
          <Card className="dark:border-gray-700 dark:bg-gray-800">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    {formatDate(post.createdAt)}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed whitespace-pre-line dark:text-gray-200">
                  {post.content}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 통계 정보 */}
          <Card className="dark:border-gray-700 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-gray-200">
                <BarChart3 className="h-5 w-5" />
                성과 통계
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded-lg bg-blue-50 p-4 text-center dark:bg-blue-900/20">
                  <Play className="mx-auto mb-2 h-8 w-8 text-blue-500" />
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {post.views.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    재생
                  </div>
                </div>
                <div className="rounded-lg bg-red-50 p-4 text-center dark:bg-red-900/20">
                  <Heart className="mx-auto mb-2 h-8 w-8 text-red-500" />
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {post.likes.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    좋아요
                  </div>
                </div>
                <div className="rounded-lg bg-green-50 p-4 text-center dark:bg-green-900/20">
                  <MessageCircle className="mx-auto mb-2 h-8 w-8 text-green-500" />
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {post.replies.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    답글
                  </div>
                </div>
                <div className="rounded-lg bg-purple-50 p-4 text-center dark:bg-purple-900/20">
                  <Repeat className="mx-auto mb-2 h-8 w-8 text-purple-500" />
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {post.reposts.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    리포스트
                  </div>
                </div>
                <div className="rounded-lg bg-orange-50 p-4 text-center dark:bg-orange-900/20">
                  <Quote className="mx-auto mb-2 h-8 w-8 text-orange-500" />
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {post.quotes.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    인용
                  </div>
                </div>
                <div className="rounded-lg bg-indigo-50 p-4 text-center dark:bg-indigo-900/20">
                  <Share2 className="mx-auto mb-2 h-8 w-8 text-indigo-500" />
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {post.shares.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    공유
                  </div>
                </div>
                <div className="rounded-lg bg-emerald-50 p-4 text-center dark:bg-emerald-900/20">
                  <Users className="mx-auto mb-2 h-8 w-8 text-emerald-500" />
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    +{post.followers}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    팔로워 증가
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 댓글 */}
          <Card className="dark:border-gray-700 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-gray-200">
                <MessageCircle className="h-5 w-5" />
                답글 ({post.commentsList.length})
              </CardTitle>
              <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <AlertDescription className="text-blue-800 dark:text-blue-200">
                  Threads API 제한으로 인해 최신 답글 3개만 표시됩니다.
                </AlertDescription>
              </Alert>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {post.commentsList.map((comment: any) => (
                  <div
                    key={comment.id}
                    className="flex gap-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-700"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={comment.avatar} />
                      <AvatarFallback className="dark:bg-gray-600 dark:text-gray-200">
                        {comment.author[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-sm font-medium dark:text-gray-200">
                          {comment.author}
                        </span>
                        <span className="text-muted-foreground text-xs dark:text-gray-400">
                          {formatRelativeTime(comment.createdAt)}
                        </span>
                      </div>
                      <p className="mb-2 text-sm dark:text-gray-300">
                        {comment.content}
                      </p>
                      <div className="text-muted-foreground flex items-center gap-1 text-xs dark:text-gray-400">
                        <Heart className="h-3 w-3" />
                        <span>{comment.likes}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 사이드바 */}
        <div className="space-y-6">
          {/* 글 설정 정보 */}
          <Card className="dark:border-gray-700 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-gray-200">
                <Target className="h-5 w-5" />글 설정
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 분위기 */}
              <div>
                <h4 className="mb-2 text-sm font-semibold dark:text-gray-200">
                  분위기
                </h4>
                <div className="flex flex-wrap gap-1">
                  {post.moods.map((mood: string, idx: number) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="text-xs dark:border-gray-600 dark:text-gray-300"
                    >
                      {mood}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* 키워드 */}
              <div>
                <h4 className="mb-2 text-sm font-semibold dark:text-gray-200">
                  키워드
                </h4>
                <div className="flex flex-wrap gap-1">
                  {post.keywords.map((keyword: string, idx: number) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="text-xs dark:bg-gray-700 dark:text-gray-200"
                    >
                      #{keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* 산업군과 톤 */}
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium dark:text-gray-200">
                    산업군:
                  </span>
                  <span className="ml-2 text-sm dark:text-gray-300">
                    {post.industry}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium dark:text-gray-200">
                    톤:
                  </span>
                  <span className="ml-2 text-sm dark:text-gray-300">
                    {post.tone}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 트렌드 분석 주석 처리
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-gray-200">
                <TrendingUp className="h-5 w-5" />
                트렌드 분석
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium dark:text-gray-200">트렌드 매칭도</span>
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">
                    {post.trendMatch}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-2 rounded-full bg-green-500"
                    style={{ width: `${post.trendMatch}%` }}
                  />
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-semibold dark:text-gray-200">현재 트렌드</h4>
                <div className="flex flex-wrap gap-1">
                  {post.trendAnalysis.currentTrends.map(
                    (trend: string, idx: number) => (
                      <Badge
                        key={idx}
                        variant={
                          post.trendAnalysis.matchedKeywords.includes(trend)
                            ? "default"
                            : "outline"
                        }
                        className={`text-xs ${
                          post.trendAnalysis.matchedKeywords.includes(trend)
                            ? "bg-green-600 hover:bg-green-700"
                            : "dark:border-gray-600 dark:text-gray-300"
                        }`}
                      >
                        {trend}
                      </Badge>
                    ),
                  )}
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-semibold dark:text-gray-200">개선 추천</h4>
                <ul className="space-y-1">
                  {post.trendAnalysis.recommendations.map(
                    (rec: string, idx: number) => (
                      <li
                        key={idx}
                        className="text-muted-foreground flex items-start gap-1 text-xs dark:text-gray-400"
                      >
                        <span className="mt-0.5 text-blue-500">•</span>
                        {rec}
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
          */}
        </div>
      </div>
    </div>
  );
}
