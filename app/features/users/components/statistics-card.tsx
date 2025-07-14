import type { DashboardStats } from "../utils/dashboard-utils";

import { BarChart3 } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";

import { AverageStats } from "./average-stats";
import { DailyStats } from "./daily-stats";

interface StatisticsCardProps {
  dashboardStats: DashboardStats;
}

export function StatisticsCard({ dashboardStats }: StatisticsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          일별 통합 성과 분석
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 평균값 요약 */}
          <AverageStats averages={dashboardStats.averages} />

          {/* 일별 상세 통계 */}
          <DailyStats dailyStats={dashboardStats.dailyStats} />
        </div>
      </CardContent>
    </Card>
  );
}
