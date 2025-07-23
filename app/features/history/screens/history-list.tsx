import type { Route } from "./+types/history-list";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouteLoaderData } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import { z } from "zod";

import { LONG_TOAST_DURATION } from "~/constants";
import { requireAuthentication } from "~/core/lib/guards.server";
import makeServerClient from "~/core/lib/supa-client.server";

import { SearchSection } from "../components/search-section";
import { ThreadList } from "../components/thread-list";
import {
  EmptyState,
  EndOfListMessage,
  LoadingSpinner,
  NoSearchResults,
} from "../components/ui-states";
import { getThreadsList } from "../queries";
import {
  formatDate,
  getPlatformDisplayName,
  truncateText,
} from "../utils/date-utils";

export const meta: Route.MetaFunction = () => {
  return [{ title: `History | ${import.meta.env.VITE_APP_NAME}` }];
};

const searchParamsSchema = z.object({
  upload: z.string().optional(),
  platform: z.string().optional(),
  search: z.string().optional(),
  page: z.string().optional(),
});

export async function loader({ request }: Route.LoaderArgs) {
  const [client, headers] = makeServerClient(request);
  const user = await requireAuthentication(client);

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

export default function HistoryList({ loaderData }: Route.ComponentProps) {
  const rootData = useRouteLoaderData("root");
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
        { autoClose: LONG_TOAST_DURATION },
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

  const truncateTextWithMaxLength = (text: string) => truncateText(text, 200);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <ToastContainer />

      {/* 검색 영역 */}
      <SearchSection searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {/* 글 목록 */}
      <ThreadList
        threads={filteredPosts}
        lastPostRef={lastPostElementRef}
        truncateText={truncateTextWithMaxLength}
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
