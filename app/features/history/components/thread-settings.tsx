import { Target } from "lucide-react";

import { Badge } from "~/core/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";

interface ThreadSettingsProps {
  thread: any;
}

export function ThreadSettings({ thread }: ThreadSettingsProps) {
  return (
    <Card className="dark:border-gray-700 dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 dark:text-gray-200">
          <Target className="h-5 w-5" />글 설정
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 원본 메모 */}
        {thread.short_text && (
          <div>
            <h4 className="mb-2 text-sm font-semibold dark:text-gray-200">
              원본 메모
            </h4>
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {thread.short_text}
              </p>
            </div>
          </div>
        )}

        {/* 속성들 */}
        <div>
          <h4 className="mb-2 text-sm font-semibold dark:text-gray-200">
            설정 정보
          </h4>
          <div className="flex flex-wrap gap-1">
            {thread.properties?.map((property: any, idx: number) => (
              <Badge
                key={idx}
                variant="outline"
                className="text-xs dark:border-gray-600 dark:text-gray-300"
              >
                {property.property}
              </Badge>
            ))}
          </div>
        </div>

        {/* 키워드 */}
        <div>
          <h4 className="mb-2 text-sm font-semibold dark:text-gray-200">
            키워드
          </h4>
          <div className="flex flex-wrap gap-1">
            {thread.keywords?.map((keyword: any, idx: number) => (
              <Badge
                key={idx}
                variant="secondary"
                className="text-xs dark:bg-gray-700 dark:text-gray-200"
              >
                #{keyword.keyword}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
