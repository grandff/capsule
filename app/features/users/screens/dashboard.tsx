import type { DashboardStats } from "../utils/dashboard-utils";
import type { Route } from "./+types/dashboard";

import { ActionCards } from "../components/action-cards";
import { StatisticsCard } from "../components/statistics-card";
import { DEFAULT_DASHBOARD_STATS } from "../utils/dashboard-utils";

export const meta: Route.MetaFunction = () => {
  return [{ title: `Dashboard | ${import.meta.env.VITE_APP_NAME}` }];
};

export default function Dashboard({ loaderData }: { loaderData: any }) {
  // 통계 데이터가 없으면 기본값 사용
  const dashboardStats: DashboardStats =
    loaderData?.dashboardStats || DEFAULT_DASHBOARD_STATS;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* 첫 번째 줄 - 액션 카드들 */}
      <ActionCards />

      {/* 두 번째 줄 - 통합 통계 */}
      <StatisticsCard dashboardStats={dashboardStats} />
    </div>
  );
}
