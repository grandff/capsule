import { Calendar, Clock } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";

export function NoTrendData() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          트렌드 분석 데이터
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Calendar className="text-muted-foreground mb-4 h-16 w-16" />
          <h3 className="mb-2 text-lg font-semibold">
            아직 트렌드 분석 데이터가 없습니다
          </h3>
          <p className="text-muted-foreground mb-4">
            관심 키워드를 설정하시면 매일 오전 6시에 해당 키워드 기반으로
            트렌드를 분석해드립니다.
          </p>
          <div className="bg-muted w-full max-w-md rounded-lg p-4">
            <p className="text-muted-foreground text-sm">
              <strong>다음 분석 예정:</strong> 내일 오전 6시
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
