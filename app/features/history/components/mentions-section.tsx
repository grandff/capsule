import { Info, Users } from "lucide-react";

import { Alert, AlertDescription } from "~/core/components/ui/alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";

interface MentionsSectionProps {
  threadId: number;
}

export function MentionsSection({ threadId }: MentionsSectionProps) {
  return (
    <Card className="dark:border-gray-700 dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 dark:text-gray-200">
          <Users className="h-5 w-5" />
          언급
        </CardTitle>
        <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            Threads API 제한으로 인해 최신 언급 3개만 표시됩니다.
          </AlertDescription>
        </Alert>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-muted-foreground text-center dark:text-gray-400">
            Threads API 제한으로 인해 언급 기능은 현재 개발 중입니다.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
