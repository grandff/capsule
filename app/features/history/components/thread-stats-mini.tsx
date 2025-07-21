import { Heart, MessageCircle, Repeat } from "lucide-react";

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

interface ThreadStatsMiniProps {
  thread: Thread;
}

export function ThreadStatsMini({ thread }: ThreadStatsMiniProps) {
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
