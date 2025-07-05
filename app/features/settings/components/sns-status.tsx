import type { SnsPlatform } from "../types/settings-type";

import { CheckCircle, Link, XCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";

export default function SnsStatus({
  connectedSNSArray,
  snsPlatforms,
}: {
  connectedSNSArray: string[];
  snsPlatforms: SnsPlatform[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          연결 현황
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="font-medium">
              {connectedSNSArray.length}개 플랫폼 연결됨
            </span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-gray-400" />
            <span className="text-muted-foreground">
              {snsPlatforms.length - connectedSNSArray.length}개 미연결
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
