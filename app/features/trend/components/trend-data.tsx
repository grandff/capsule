import type { Trend } from "../queries";

import { TrendingUp } from "lucide-react";

import { Badge } from "~/core/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/core/components/ui/hover-card";

interface TrendDataProps {
  trend: Trend;
}

export function TrendData({ trend }: TrendDataProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          인기 키워드 TOP {trend.trend_keywords.length}
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          {trend.trend_date} 기준 트렌드 분석 결과
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {trend.trend_keywords
            .sort((a, b) => a.rank - b.rank)
            .map((keyword) => (
              <div
                key={keyword.trend_keyword_id}
                className="rounded-lg border p-4 transition-shadow hover:shadow-md"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">
                      #{keyword.rank}
                    </span>
                    <Badge variant="outline" className="text-sm">
                      {keyword.keyword}
                    </Badge>
                  </div>
                </div>
                <div className="text-muted-foreground text-sm">
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <p className="line-clamp-3">{keyword.description}</p>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="font-medium">
                          #{keyword.rank} {keyword.keyword}
                        </h4>
                        <p className="text-sm">{keyword.description}</p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
