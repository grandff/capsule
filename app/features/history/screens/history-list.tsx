import {
  Calendar,
  Eye,
  Heart,
  MessageCircle,
  Search,
  TrendingUp,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router";

import { Badge } from "~/core/components/ui/badge";
import { Button } from "~/core/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";
import { Input } from "~/core/components/ui/input";

export default function HistoryList() {
  const [posts, setPosts] = useState<any[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef<IntersectionObserver | null>(null);

  // 샘플 데이터 생성
  const generateSamplePosts = (pageNum: number, count: number) => {
    const samplePosts = [];
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

    for (let i = 0; i < count; i++) {
      const postId = (pageNum - 1) * count + i + 1;
      samplePosts.push({
        id: postId,
        title: `오늘의 이야기 ${postId}`,
        content: `오늘은 정말 특별한 하루였습니다. 새로운 기술을 배우면서 많은 것을 깨달았고, 팀원들과 함께 프로젝트를 진행하면서 협업의 중요성을 다시 한번 느꼈습니다. 특히 AI 기술의 발전 속도가 놀라워서, 앞으로의 변화가 기대됩니다.`,
        createdAt: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
        ),
        likes: Math.floor(Math.random() * 1000) + 50,
        comments: Math.floor(Math.random() * 100) + 5,
        views: Math.floor(Math.random() * 5000) + 200,
        followers: Math.floor(Math.random() * 500) + 20,
        moods: moods.slice(0, Math.floor(Math.random() * 3) + 1),
        keywords: keywords.slice(0, Math.floor(Math.random() * 4) + 2),
        trendMatch: Math.floor(Math.random() * 40) + 60, // 60-100%
        industry: ["IT/기술", "금융", "의료", "교육", "엔터테인먼트"][
          Math.floor(Math.random() * 5)
        ],
        tone: ["공식적", "친근함", "유머러스", "감성적", "전문적"][
          Math.floor(Math.random() * 5)
        ],
      });
    }
    return samplePosts;
  };

  // 초기 데이터 로드
  useEffect(() => {
    const initialPosts = generateSamplePosts(1, 20);
    setPosts(initialPosts);
    setFilteredPosts(initialPosts);
  }, []);

  // 검색 필터링
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.keywords.some((keyword: string) =>
            keyword.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
      setFilteredPosts(filtered);
    }
  }, [searchTerm, posts]);

  // 무한 스크롤을 위한 마지막 요소 참조
  const lastPostElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMorePosts();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  // 추가 포스트 로드
  const loadMorePosts = async () => {
    setLoading(true);
    // 실제 API 호출을 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newPosts = generateSamplePosts(page + 1, 20);
    setPosts((prev) => [...prev, ...newPosts]);
    setPage((prev) => prev + 1);

    // 더 이상 로드할 데이터가 없으면 hasMore를 false로 설정
    if (page >= 5) {
      // 샘플 데이터로 5페이지까지만
      setHasMore(false);
    }
    setLoading(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* 검색 영역 */}
      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
        <Input
          type="text"
          placeholder="글 제목, 내용, 키워드로 검색하세요..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="py-3 pr-4 pl-10 text-lg"
        />
      </div>

      {/* 글 목록 */}
      <div className="space-y-4">
        {filteredPosts.map((post, index) => (
          <div
            key={post.id}
            ref={index === filteredPosts.length - 1 ? lastPostElementRef : null}
          >
            <Link to={`/dashboard/history/${post.id}`}>
              <Card className="cursor-pointer transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="mb-2 text-lg">
                        {post.title}
                      </CardTitle>
                      <p className="text-muted-foreground mb-3 text-sm">
                        {truncateText(post.content, 150)}
                      </p>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      {formatDate(post.createdAt)}
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* 통계 정보 */}
                  <div className="mb-4 flex items-center gap-6 text-sm">
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
                      <span>팔로워 +{post.followers}</span>
                    </div>
                  </div>

                  {/* 분위기, 키워드, 트렌드 매칭 */}
                  <div className="space-y-3">
                    {/* 분위기 */}
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        분위기:{" "}
                      </span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {post.moods.map((mood: string, idx: number) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs"
                          >
                            {mood}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* 키워드 */}
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        키워드:{" "}
                      </span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {post.keywords.map((keyword: string, idx: number) => (
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

                    {/* 트렌드 매칭 */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-600">
                        트렌드 매칭:
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-20 rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-green-500"
                            style={{ width: `${post.trendMatch}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-green-600">
                          {post.trendMatch}%
                        </span>
                      </div>
                    </div>

                    {/* 산업군과 톤 */}
                    <div className="flex gap-4 text-sm">
                      <span className="text-gray-600">
                        <span className="font-medium">산업군:</span>{" "}
                        {post.industry}
                      </span>
                      <span className="text-gray-600">
                        <span className="font-medium">톤:</span> {post.tone}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        ))}
      </div>

      {/* 로딩 상태 */}
      {loading && (
        <div className="flex justify-center py-4">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* 더 이상 데이터가 없을 때 */}
      {!hasMore && filteredPosts.length > 0 && (
        <div className="text-muted-foreground py-4 text-center">
          모든 글을 불러왔습니다.
        </div>
      )}

      {/* 검색 결과가 없을 때 */}
      {searchTerm && filteredPosts.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">검색 결과가 없습니다.</p>
          <Button
            variant="outline"
            onClick={() => setSearchTerm("")}
            className="mt-2"
          >
            검색어 지우기
          </Button>
        </div>
      )}
    </div>
  );
}
