import type { Route } from "./+types/private.layout";

import { useEffect } from "react";
import { Outlet, redirect } from "react-router";
import { useRouteLoaderData } from "react-router";

import { getSetting } from "../../features/settings/queries";
import { refreshToken } from "../../features/settings/utils/refresh-token-util";
import { SettingsCache } from "../lib/settings-cache";
import makeServerClient from "../lib/supa-client.server";

export async function loader({ request }: Route.LoaderArgs) {
  const [client] = makeServerClient(request);
  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    throw redirect("/login");
  }

  // 사용자 설정 로드 (캐시 우선)
  let userSettings = null;

  try {
    // 캐시에서 먼저 확인
    const cachedSettings = SettingsCache.get(user.id);

    if (cachedSettings) {
      userSettings = cachedSettings;
    } else {
      userSettings = await getSetting(client, user.id);

      // 캐시에 저장
      if (userSettings) {
        SettingsCache.set(user.id, userSettings);
      }
    }

    // 매일 최초 1회만 토큰 재발급 시도 (백그라운드에서 실행)
    Promise.resolve().then(async () => {
      try {
        await refreshToken(client, user.id);
      } catch (error) {
        console.error("토큰 재발급 중 오류:", error);
      }
    });
  } catch (error) {
    console.error("사용자 설정 로드 중 오류:", error);
    // 설정 로드 실패 시 기본값 사용
  }

  return { user, userSettings };
}

export default function PrivateLayout() {
  const data = useRouteLoaderData("private");

  // 사용자 설정 적용
  useEffect(() => {
    const applyUserSettings = (settings: any) => {
      if (!settings) return;

      // 기존 글꼴 크기 클래스 제거
      document.documentElement.classList.remove(
        "font-size-large",
        "font-size-larger",
      );

      // 글꼴 크기 적용 - CSS 클래스 사용
      if (settings.fontSize === "large") {
        document.documentElement.classList.add("font-size-large");
      } else if (settings.fontSize === "larger") {
        document.documentElement.classList.add("font-size-larger");
      }

      // 색약 모드 적용
      if (settings.colorBlindMode) {
        document.body.classList.add("colorblind-mode");
      } else {
        document.body.classList.remove("colorblind-mode");
      }
    };

    // 설정이 있으면 적용
    if (data?.userSettings) {
      applyUserSettings(data.userSettings);
    }
  }, [data?.userSettings]);

  return <Outlet />;
}
