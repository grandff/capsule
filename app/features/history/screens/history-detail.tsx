import type { Route } from "./+types/history-detail";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { z } from "zod";

import { cacheKeys, memoryCache } from "~/core/lib/cache";
import { requireAuthentication } from "~/core/lib/guards.server";
import makeServerClient from "~/core/lib/supa-client.server";

import { BackButton } from "../components/back-button";
import { CommentsSection } from "../components/comments-section";
import { MentionsSection } from "../components/mentions-section";
import { ThreadContent } from "../components/thread-content";
import { ThreadSettings } from "../components/thread-settings";
import { ThreadStats } from "../components/thread-stats";
import { getThreadDetail } from "../queries";

const paramsSchema = z.object({
  id: z.string(),
});

export async function loader({ request, params }: Route.LoaderArgs) {
  const [client, headers] = makeServerClient(request);
  await requireAuthentication(client);

  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const parsedParams = paramsSchema.safeParse(params);
  if (!parsedParams.success) {
    throw new Response("Invalid thread ID", { status: 400 });
  }

  const threadId = parseInt(parsedParams.data.id, 10);
  if (isNaN(threadId)) {
    throw new Response("Invalid thread ID", { status: 400 });
  }

  try {
    const thread = await getThreadDetail(client, user.id, threadId);
    return { thread };
  } catch (error) {
    console.error("Error loading thread detail:", error);
    throw new Response("Thread not found", { status: 404 });
  }
}

export default function HistoryDetail({ loaderData }: Route.ComponentProps) {
  const { thread } = loaderData;
  const [isUpdatingInsights, setIsUpdatingInsights] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>(thread.updated_at);

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

  // Insight 업데이트 함수
  const handleUpdateInsights = async () => {
    setIsUpdatingInsights(true);
    try {
      // 관련 캐시 무효화
      memoryCache.delete(cacheKeys.insights(thread.thread_id));
      memoryCache.delete(cacheKeys.replies(thread.thread_id));
      memoryCache.delete(cacheKeys.mentions(thread.thread_id));

      // 1. 먼저 retrieve-user-posts 호출 (result_id 기준)
      if (thread.result_id) {
        try {
          const retrieveRes = await fetch(
            `/api/history/retrieve-user-posts/${thread.result_id}`,
          );
          const retrieveData = await retrieveRes.json();
          console.log("[retrieve-user-posts] 응답:", retrieveData);

          // 게시글을 찾을 수 없는 경우 인사이트 업데이트 중단
          if (!retrieveData.success) {
            toast.error(retrieveData.message || "게시글을 찾을 수 없습니다.");
            // 페이지 새로고침으로 업데이트된 상태 반영
            window.location.reload();
            return;
          }
        } catch (err) {
          console.error("[retrieve-user-posts] 호출 오류:", err);
          toast.error("게시글 조회 중 오류가 발생했습니다.");
          return;
        }
      }

      // 2. 기존 인사이트 업데이트 로직
      const formData = new FormData();
      formData.append("threadId", thread.thread_id.toString());

      const response = await fetch("/api/history/update-insights", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        toast.success("인사이트가 업데이트되었습니다!");
        // 페이지 새로고침으로 업데이트된 데이터 반영
        window.location.reload();
      } else {
        console.error("Failed to update insights:", result.message);
        toast.error(result.message || "인사이트 업데이트에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error updating insights:", error);
      toast.error("인사이트 업데이트 중 오류가 발생했습니다.");
    } finally {
      setIsUpdatingInsights(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <ToastContainer />
      {/* 뒤로가기 버튼 */}
      <BackButton />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 메인 콘텐츠 */}
        <div className="space-y-6 lg:col-span-2">
          {/* 글 내용 */}
          <ThreadContent thread={thread} formatDate={formatDate} />

          {/* 통계 정보 */}
          <ThreadStats
            thread={thread}
            onUpdateInsights={handleUpdateInsights}
            isUpdating={isUpdatingInsights}
          />

          {/* 댓글 */}
          <CommentsSection resultId={thread.result_id} />

          {/* 언급 */}
          {/* <MentionsSection threadId={thread.thread_id} /> */}
        </div>

        {/* 사이드바 */}
        <div className="space-y-6">
          {/* 글 설정 정보 */}
          <ThreadSettings thread={thread} />
        </div>
      </div>
    </div>
  );
}
