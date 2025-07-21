type ThreadStatus = "active" | "not_uploaded" | "deleted" | "error";

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

interface ThreadStatusBadgeProps {
  thread: Thread;
}

export function ThreadStatusBadge({ thread }: ThreadStatusBadgeProps) {
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
