import type { Route } from "./+types/history-detail";

import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

import { requireAuthentication } from "~/core/lib/guards.server";
import makeServerClient from "~/core/lib/supa-client.server";
import { getFollowersCount } from "~/features/users/queries";

import { BackButton } from "../components/back-button";
import { CommentsSection } from "../components/comments-section";
import { ThreadContent } from "../components/thread-content";
import { ThreadSettings } from "../components/thread-settings";
import { ThreadStats } from "../components/thread-stats";
import { getFollowerChange, getThreadDetail } from "../queries";

export const meta: Route.MetaFunction = () => {
  return [{ title: `Detail | ${import.meta.env.VITE_APP_NAME}` }];
};

const paramsSchema = z.object({
  id: z.string(),
});

export async function loader({ request, params }: Route.LoaderArgs) {
  const [client] = makeServerClient(request);
  const user = await requireAuthentication(client);

  const parsedParams = paramsSchema.safeParse(params);
  if (!parsedParams.success) {
    throw new Response("Invalid thread ID", { status: 400 });
  }

  const threadId = parsedParams.data.id;
  const profileId = user.id;

  try {
    const thread = await getThreadDetail(client, threadId);

    // followers_history에서 followerChange 값 조회 (없으면 0)
    let followerChange = 0;
    try {
      const followerData = await getFollowersCount(client, {
        profileId,
        threadId: Number(threadId),
      });
      if (
        Array.isArray(followerData) &&
        followerData.length > 0 &&
        typeof followerData[0].follower_count === "number"
      ) {
        followerChange = followerData[0].follower_count;
      }
    } catch (followerError) {
      console.error("Error fetching follower change:", followerError);
      // 에러 시 0 유지
    }

    return { thread, followerChange };
  } catch (error) {
    console.error("Error loading thread detail:", error);
    throw new Response("Thread not found", { status: 404 });
  }
}

export default function HistoryDetail({ loaderData }: Route.ComponentProps) {
  const { thread } = loaderData;
  const [lastUpdated, setLastUpdated] = useState<string>(thread.updated_at);
  const fetcher = useFetcher();

  // fetcher 상태 감지하여 toast 메시지 표시
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.success) {
        toast.success("인사이트가 업데이트되었습니다!");
      } else {
        toast.error(
          fetcher.data.message || "인사이트 업데이트에 실패했습니다.",
        );
      }
    }
  }, [fetcher.state, fetcher.data]);

  // 새로고침 핸들러
  const handleRefresh = () => {
    fetcher.submit(
      { threadId: thread.thread_id, resultId: thread.result_id ?? "" },
      { method: "post", action: "/api/history/update-insights" },
    );
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* 뒤로가기 버튼 */}
      <BackButton />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 메인 콘텐츠 */}
        <div className="space-y-6 lg:col-span-2">
          {/* 글 내용 */}
          <ThreadContent thread={thread} />

          {/* 통계 정보 */}
          <ThreadStats
            thread={thread}
            followerChange={{
              currentFollowers: 0,
              baselineFollowers: 0,
              followerChange: loaderData.followerChange,
              isPositive: loaderData.followerChange > 0,
              isNegative: loaderData.followerChange < 0,
              isNeutral: loaderData.followerChange === 0,
            }}
            isUpdating={fetcher.state === "submitting"}
            onRefresh={handleRefresh}
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
