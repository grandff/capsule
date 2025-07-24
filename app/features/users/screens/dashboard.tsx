import type { DashboardStats } from "../utils/dashboard-utils";
import type { Route } from "./+types/dashboard";

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

import { requireAuthentication } from "~/core/lib/guards.server";
import makeServerClient from "~/core/lib/supa-client.server";
import { getConnectionStatus } from "~/features/settings/queries";
import type { TrendKeyword } from "~/features/trend/queries";
import { getThisWeekTrends } from "~/features/trend/queries";

import { ActionCards } from "../components/action-cards";
import { OnboardingDialog } from "../components/onboarding-dialog";
import { StatisticsCard } from "../components/statistics-card";
import { updateIsFirstLogin } from "../mutations";
import { getDashboardStats, getIsFirstLogin } from "../queries";
import { DEFAULT_DASHBOARD_STATS } from "../utils/dashboard-utils";

// AppInterface 타입 정의
declare global {
  interface Window {
    AppInterface?: {
      postMessage: (message: string) => void;
    };
  }
}

export const meta: Route.MetaFunction = () => {
  return [{ title: `Dashboard | ${import.meta.env.VITE_APP_NAME}` }];
};

export async function loader({ request }: Route.LoaderArgs) {
  const [client] = makeServerClient(request);
  const user = await requireAuthentication(client);

  try {
    const [dashboardStats, thisWeekTrends, isFirstLogin, connectionStatus] =
      await Promise.all([
        getDashboardStats(client, { userId: user.id }),
        getThisWeekTrends(client),
        getIsFirstLogin(client, user.id),
        getConnectionStatus(client, user.id),
      ]);

    return { dashboardStats, thisWeekTrends, isFirstLogin, connectionStatus };
  } catch (error) {
    console.error("Error loading dashboard data:", error);
    return {
      dashboardStats: null,
      thisWeekTrends: [],
      isFirstLogin: null,
      connectionStatus: null,
    };
  }
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const [searchParams] = useSearchParams();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isOnboardingLoading, setIsOnboardingLoading] = useState(false);
  const [isCloseLoading, setIsCloseLoading] = useState(false);

  // 통계 데이터가 없으면 기본값 사용
  const dashboardStats: DashboardStats =
    loaderData?.dashboardStats || DEFAULT_DASHBOARD_STATS;
  const thisWeekTrends: TrendKeyword[] = loaderData?.thisWeekTrends || [];

  // 최초 접속 여부 확인 및 온보딩 다이얼로그 표시
  useEffect(() => {
    if (loaderData?.isFirstLogin?.is_first_login) {
      setShowOnboarding(true);
    }
  }, [loaderData?.isFirstLogin]);

  // 앱에 테마 정보 전송
  useEffect(() => {
    const theme = searchParams.get("theme");
    if (theme && window.AppInterface) {
      window.AppInterface.postMessage(
        JSON.stringify({
          type: "THEME_INIT",
          theme: theme,
        }),
      );
    }
  }, [searchParams]);

  // 온보딩 완료 처리
  const handleOnboardingComplete = async () => {
    setIsOnboardingLoading(true);
    try {
      // 최초 접속 여부를 false로 업데이트
      const response = await fetch("/api/users/update-first-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isFirstLogin: false }),
      });

      if (response.ok) {
        setShowOnboarding(false);
      }
    } catch (error) {
      console.error("Error updating first login status:", error);
      // 에러가 발생해도 다이얼로그는 닫기
      setShowOnboarding(false);
    } finally {
      setIsOnboardingLoading(false);
    }
  };

  // 온보딩 닫기 처리
  const handleOnboardingClose = async () => {
    setIsCloseLoading(true);
    try {
      // 최초 접속 여부를 false로 업데이트
      const response = await fetch("/api/users/update-first-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isFirstLogin: false }),
      });

      if (response.ok) {
        setShowOnboarding(false);
      }
    } catch (error) {
      console.error("Error updating first login status:", error);
      // 에러가 발생해도 다이얼로그는 닫기
      setShowOnboarding(false);
    } finally {
      setIsCloseLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* 첫 번째 줄 - 액션 카드들 */}
        <ActionCards thisWeekTrends={thisWeekTrends} />

        {/* 두 번째 줄 - 통합 통계 */}
        <StatisticsCard dashboardStats={dashboardStats} />
      </div>

      {/* 온보딩 다이얼로그 */}
      <OnboardingDialog
        isOpen={showOnboarding}
        onClose={handleOnboardingClose}
        onComplete={handleOnboardingComplete}
        isThreadsConnected={
          loaderData?.connectionStatus?.threadsConnected || false
        }
        isOnboardingLoading={isOnboardingLoading}
        isCloseLoading={isCloseLoading}
      />
    </>
  );
}
