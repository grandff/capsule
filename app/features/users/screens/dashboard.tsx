import type { DashboardStats } from "../utils/dashboard-utils";
import type { Route } from "./+types/dashboard";

import { requireAuthentication } from "~/core/lib/guards.server";
import makeServerClient from "~/core/lib/supa-client.server";
import type { TrendKeyword } from "~/features/trend/queries";
import { getThisWeekTrends } from "~/features/trend/queries";

import { ActionCards } from "../components/action-cards";
import { StatisticsCard } from "../components/statistics-card";
import { getDashboardStats } from "../queries";
import { DEFAULT_DASHBOARD_STATS } from "../utils/dashboard-utils";

export const meta: Route.MetaFunction = () => {
  return [{ title: `Dashboard | ${import.meta.env.VITE_APP_NAME}` }];
};

export async function loader({ request }: Route.LoaderArgs) {
  const [client] = makeServerClient(request);
  const user = await requireAuthentication(client);

  try {
    const [dashboardStats, thisWeekTrends] = await Promise.all([
      getDashboardStats(client, { userId: user.id }),
      getThisWeekTrends(client),
    ]);

    return { dashboardStats, thisWeekTrends };
  } catch (error) {
    console.error("Error loading dashboard data:", error);
    return { dashboardStats: null, thisWeekTrends: [] };
  }
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  // 통계 데이터가 없으면 기본값 사용
  const dashboardStats: DashboardStats =
    loaderData?.dashboardStats || DEFAULT_DASHBOARD_STATS;
  const thisWeekTrends: TrendKeyword[] = loaderData?.thisWeekTrends || [];

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* 첫 번째 줄 - 액션 카드들 */}
      <ActionCards thisWeekTrends={thisWeekTrends} />

      {/* 두 번째 줄 - 통합 통계 */}
      <StatisticsCard dashboardStats={dashboardStats} />
    </div>
  );
}
