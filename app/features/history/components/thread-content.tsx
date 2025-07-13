import { Calendar } from "lucide-react";

import { Card, CardContent, CardHeader } from "~/core/components/ui/card";

interface ThreadContentProps {
  thread: any;
  formatDate: (date: string) => string;
}

export function ThreadContent({ thread, formatDate }: ThreadContentProps) {
  return (
    <Card className="dark:border-gray-700 dark:bg-gray-800">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              {formatDate(thread.created_at)}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg leading-relaxed whitespace-pre-line dark:text-gray-200">
            {thread.thread}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
