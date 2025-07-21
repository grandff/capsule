import { Calendar } from "lucide-react";
import { DateTime } from "luxon";
import { Link } from "react-router";

import { Card, CardContent, CardHeader } from "~/core/components/ui/card";

import { ThreadStatsMini } from "./thread-stats-mini";
import { ThreadStatusBadge } from "./thread-status-badge";

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

interface ThreadListProps {
  threads: Thread[];
  lastPostRef: (node: HTMLDivElement) => void;
  truncateText: (text: string, maxLength: number) => string;
}

export function ThreadList({
  threads,
  lastPostRef,
  truncateText,
}: ThreadListProps) {
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
                      {DateTime.fromISO(thread.created_at, {
                        zone: "utc",
                      })
                        .toLocal()
                        .setLocale(navigator.language)
                        .toLocaleString(DateTime.DATETIME_MED)}
                      <ThreadStatusBadge thread={thread} />
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {truncateText(thread.thread, 200)}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <ThreadStatsMini thread={thread} />
              </CardContent>
            </Card>
          </Link>
        </div>
      ))}
    </div>
  );
}
