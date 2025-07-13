import type { Route } from "./+types/history-list";

import {
  Calendar,
  Heart,
  MessageCircle,
  Quote,
  Repeat,
  Search,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import { z } from "zod";

import { Button } from "~/core/components/ui/button";
import { Card, CardContent, CardHeader } from "~/core/components/ui/card";
import { Input } from "~/core/components/ui/input";
import { requireAuthentication } from "~/core/lib/guards.server";
import makeServerClient from "~/core/lib/supa-client.server";

import { getThreadsList } from "../queries";

const searchParamsSchema = z.object({
  upload: z.string().optional(),
  platform: z.string().optional(),
  search: z.string().optional(),
  page: z.string().optional(),
});

export async function loader({ request }: Route.LoaderArgs) {
  const [client, headers] = makeServerClient(request);
  await requireAuthentication(client);

  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(request.url);
  const params = searchParamsSchema.safeParse(
    Object.fromEntries(url.searchParams.entries()),
  );

  const searchParams = params.success ? params.data : {};

  try {
    const threadsData = await getThreadsList(client, user.id, {
      page: 1,
      limit: 20,
      search: searchParams.search || "",
    });

    return { threadsData, searchParams };
  } catch (error) {
    console.error("Error loading threads:", error);
    return {
      threadsData: {
        threads: [],
        totalCount: 0,
        hasMore: false,
        currentPage: 1,
        totalPages: 0,
      },
      searchParams,
    };
  }
}

interface Thread {
  thread_id: number;
  short_text: string;
  thread: string;
  target_type: "thread" | "X";
  send_flag: boolean;
  result_id: string | null;
  share_cnt: number;
  like_cnt: number;
  comment_cnt: number;
  view_cnt: number;
  now_follow_cnt: number;
  created_at: string;
  updated_at: string;
}

type ThreadStatus = "active" | "not_uploaded" | "deleted" | "error";

export default function HistoryList({ loaderData }: Route.ComponentProps) {
  const [posts, setPosts] = useState<Thread[]>(loaderData.threadsData.threads);
  const [filteredPosts, setFilteredPosts] = useState<Thread[]>(
    loaderData.threadsData.threads,
  );
  const [searchTerm, setSearchTerm] = useState(
    loaderData.searchParams.search || "",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(loaderData.threadsData.hasMore);
  const [page, setPage] = useState(loaderData.threadsData.currentPage);
  const observer = useRef<IntersectionObserver | null>(null);

  // 업로드 성공 toast 알림
  useEffect(() => {
    if (
      loaderData.searchParams.upload === "success" &&
      loaderData.searchParams.platform
    ) {
      toast.success(
        `홍보글이 저장되었습니다. ${getPlatformDisplayName(loaderData.searchParams.platform)} 업로드가 진행 중입니다.`,
        { autoClose: 5000 },
      );
    }
  }, [loaderData.searchParams.upload, loaderData.searchParams.platform]);

  // 실제 데이터 로드
  useEffect(() => {
    setPosts(loaderData.threadsData.threads);
    setFilteredPosts(loaderData.threadsData.threads);
  }, [loaderData.threadsData.threads]);

  // 검색 필터링
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(
        (post) =>
          post.short_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.thread.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredPosts(filtered);
    }
  }, [searchTerm, posts]);

  // 무한 스크롤을 위한 마지막 요소 참조
  const lastPostElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMorePosts();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore],
  );

  // 추가 포스트 로드
  const loadMorePosts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/dashboard/history?page=${page + 1}&search=${searchTerm}`,
      );
      const data = await response.json();

      if (data.threads) {
        setPosts((prev) => [...prev, ...data.threads]);
        setPage((prev) => prev + 1);
        setHasMore(data.hasMore);
      }
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
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

  const getPlatformDisplayName = (platform: string) => {
    switch (platform) {
      case "thread":
        return "Threads";
      case "X":
        return "X (Twitter)";
      default:
        return platform;
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <ToastContainer />

      {/* 검색 영역 */}
      <SearchSection searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {/* 글 목록 */}
      <ThreadList
        threads={filteredPosts}
        lastPostRef={lastPostElementRef}
        formatDate={formatDate}
        truncateText={truncateText}
      />

      {/* 로딩 상태 */}
      {isLoading && <LoadingSpinner />}

      {/* 더 이상 데이터가 없을 때 */}
      {!hasMore && filteredPosts.length > 0 && <EndOfListMessage />}

      {/* 검색 결과가 없을 때 */}
      {searchTerm && filteredPosts.length === 0 && (
        <NoSearchResults onClearSearch={() => setSearchTerm("")} />
      )}

      {/* 등록된 글이 없을 때 */}
      {!searchTerm && filteredPosts.length === 0 && <EmptyState />}
    </div>
  );
}

// 서브 컴포넌트들
function SearchSection({
  searchTerm,
  onSearchChange,
}: {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400 dark:text-gray-500" />
      <Input
        type="text"
        placeholder="글 내용으로 검색하세요..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="py-3 pr-4 pl-10 text-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400"
      />
    </div>
  );
}

function ThreadList({
  threads,
  lastPostRef,
  formatDate,
  truncateText,
}: {
  threads: Thread[];
  lastPostRef: (node: HTMLDivElement) => void;
  formatDate: (date: string) => string;
  truncateText: (text: string, maxLength: number) => string;
}) {
  return (
    <div className="space-y-4">
      {threads.map((thread, index) => (
        <div
          key={thread.thread_id}
          ref={index === threads.length - 1 ? lastPostRef : null}
        >
          <Link to={`/dashboard/history/${thread.thread_id}`}>
            <Card className="cursor-pointer transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-muted-foreground mb-4 flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      {formatDate(thread.created_at)}
                      <ThreadStatusBadge thread={thread} />
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {truncateText(thread.thread, 200)}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <ThreadStats thread={thread} />
              </CardContent>
            </Card>
          </Link>
        </div>
      ))}
    </div>
  );
}

function ThreadStatusBadge({ thread }: { thread: Thread }) {
  const getStatus = (): {
    status: ThreadStatus;
    label: string;
    color: string;
  } => {
    if (!thread.result_id || thread.result_id === "ERROR") {
      return {
        status: "not_uploaded",
        label: "업로드 대기",
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200",
      };
    }
    if (thread.result_id === "DELETED") {
      return {
        status: "deleted",
        label: "삭제됨",
        color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200",
      };
    }
    return {
      status: "active",
      label: "활성",
      color:
        "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200",
    };
  };

  const { label, color } = getStatus();

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${color}`}
    >
      {label}
    </span>
  );
}

function ThreadStats({ thread }: { thread: Thread }) {
  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="flex items-center gap-1">
        <Heart className="h-4 w-4 text-red-500" />
        <span>{thread.like_cnt.toLocaleString()}</span>
      </div>
      <div className="flex items-center gap-1">
        <MessageCircle className="h-4 w-4 text-green-500" />
        <span>{thread.comment_cnt.toLocaleString()}</span>
      </div>
      <div className="flex items-center gap-1">
        <Repeat className="h-4 w-4 text-purple-500" />
        <span>{thread.share_cnt.toLocaleString()}</span>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center py-4">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
    </div>
  );
}

function EndOfListMessage() {
  return (
    <div className="text-muted-foreground py-4 text-center dark:text-gray-400">
      모든 글을 불러왔습니다.
    </div>
  );
}

function NoSearchResults({ onClearSearch }: { onClearSearch: () => void }) {
  return (
    <div className="py-8 text-center">
      <p className="text-muted-foreground dark:text-gray-400">
        검색 결과가 없습니다.
      </p>
      <Button
        variant="outline"
        onClick={onClearSearch}
        className="mt-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        검색어 지우기
      </Button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mx-auto mb-6 h-24 w-24 rounded-full bg-gray-100 p-6 dark:bg-gray-800">
        <Quote className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
        아직 등록된 글이 없습니다
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md dark:text-gray-400">
        첫 번째 홍보글을 작성하고 소셜 미디어에서 효과적으로 마케팅을
        시작해보세요.
      </p>
      <Link to="/dashboard/write">
        <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700">
          새로운 글 작성하기
        </Button>
      </Link>
    </div>
  );
}
