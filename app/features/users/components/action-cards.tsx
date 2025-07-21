import {
  BarChart3,
  Clock,
  Construction,
  Target,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router";

import { Button } from "~/core/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";
import type { TrendKeyword } from "~/features/trend/queries";

interface ActionCardsProps {
  thisWeekTrends: TrendKeyword[];
}

export function ActionCards({ thisWeekTrends }: ActionCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {/* 1. 새로운 글 작성 */}
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            새로운 글 작성
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col justify-between">
          <p className="text-muted-foreground mb-4">
            오늘의 이야기를 작성하고 트렌드에 맞는 홍보글을 만들어보세요!
          </p>
          <Link to="/dashboard/write/today">
            <Button className="w-full">글 작성하기</Button>
          </Link>
        </CardContent>
      </Card>

      {/* 2. 이번주 트렌드 */}
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            이번주 트렌드
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col">
          {thisWeekTrends.length > 0 ? (
            <div className="space-y-2">
              {thisWeekTrends.slice(0, 5).map((trend) => (
                <div
                  key={trend.trend_keyword_id}
                  className="flex items-center gap-2"
                >
                  <span className="text-muted-foreground text-xs font-medium">
                    #{trend.rank}
                  </span>
                  <span className="text-sm">{trend.keyword}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center">
              <Construction className="text-muted-foreground mb-4 h-12 w-12" />
              <p className="text-muted-foreground text-center text-sm">
                트렌드 데이터가
                <br />
                없습니다
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. 챌린지 현황 - 준비 중 */}
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            챌린지 현황
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col items-center justify-center">
          <Clock className="text-muted-foreground mb-4 h-12 w-12" />
          <p className="text-muted-foreground text-center text-sm">
            챌린지 기능이
            <br />
            준비 중입니다
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
