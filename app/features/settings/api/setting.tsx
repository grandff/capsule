import type { Route } from "./+types/setting";

import { data } from "react-router";

import makeServerClient from "~/core/lib/supa-client.server";

import { saveSetting } from "../mutations";
import { getSetting } from "../queries";

/**
 * 설정 API 엔드포인트
 *
 * GET 파라미터로 동작을 구분:
 * - action=save: 설정 저장
 * - action=get: 설정 조회 (기본값)
 *
 * 설정 저장 시 필요한 파라미터:
 * - theme: 테마 설정 (light/dark/system)
 * - fontSize: 글꼴 크기 (default/large/larger)
 * - blindMode: 색약 모드 (true/false)
 */
export async function loader({ request }: Route.LoaderArgs) {
  const [client, headers] = makeServerClient(request);
  const url = new URL(request.url);
  const action = url.searchParams.get("action") || "get";

  try {
    // 현재 사용자 정보 가져오기
    const {
      data: { user },
      error: authError,
    } = await client.auth.getUser();

    if (authError || !user) {
      return data(
        { error: "인증되지 않은 사용자입니다." },
        { status: 401, headers },
      );
    }

    if (action === "save") {
      // 설정 저장
      const theme = url.searchParams.get("theme");
      const fontSize = url.searchParams.get("fontSize");
      const blindMode = url.searchParams.get("blindMode");

      // 필수 파라미터 검증
      if (!theme || !fontSize || blindMode === null) {
        return data(
          {
            error:
              "필수 파라미터가 누락되었습니다. (theme, fontSize, blindMode)",
          },
          { status: 400, headers },
        );
      }

      // 파라미터 값 검증
      const validThemes = ["light", "dark", "system"];
      const validFontSizes = ["default", "large", "larger"];

      if (!validThemes.includes(theme)) {
        return data(
          { error: "잘못된 테마 값입니다." },
          { status: 400, headers },
        );
      }

      if (!validFontSizes.includes(fontSize)) {
        return data(
          { error: "잘못된 글꼴 크기 값입니다." },
          { status: 400, headers },
        );
      }

      const blindModeBool = blindMode === "true";

      // 설정 저장
      await saveSetting(client, {
        userId: user.id,
        theme,
        fontSize,
        blindMode: blindModeBool,
      });

      return data(
        {
          success: true,
          message: "설정이 성공적으로 저장되었습니다.",
          data: { theme, fontSize, blindMode: blindModeBool },
        },
        { headers },
      );
    } else if (action === "get") {
      // 설정 조회
      const settings = await getSetting(client, user.id);

      return data(
        {
          success: true,
          data: settings,
        },
        { headers },
      );
    } else {
      return data(
        {
          error: "잘못된 action 값입니다.",
        },
        { status: 400, headers },
      );
    }
  } catch (error) {
    console.error("설정 API 오류:", error);
    return data(
      {
        error: "서버 오류가 발생했습니다.",
      },
      { status: 500, headers },
    );
  }
}

/**
 * POST 요청도 지원 (설정 저장용)
 */
export async function action({ request }: Route.ActionArgs) {
  const [client, headers] = makeServerClient(request);

  try {
    const {
      data: { user },
      error: authError,
    } = await client.auth.getUser();

    if (authError || !user) {
      return data(
        { error: "인증되지 않은 사용자입니다." },
        { status: 401, headers },
      );
    }

    const formData = await request.formData();
    const theme = formData.get("theme") as string;
    const fontSize = formData.get("fontSize") as string;
    const blindMode = formData.get("blindMode") as string;

    // 필수 파라미터 검증
    if (!theme || !fontSize || blindMode === null) {
      return data(
        {
          error: "필수 파라미터가 누락되었습니다. (theme, fontSize, blindMode)",
        },
        { status: 400, headers },
      );
    }

    // 파라미터 값 검증
    const validThemes = ["light", "dark", "system"];
    const validFontSizes = ["default", "large", "larger"];

    if (!validThemes.includes(theme)) {
      return data({ error: "잘못된 테마 값입니다." }, { status: 400, headers });
    }

    if (!validFontSizes.includes(fontSize)) {
      return data(
        { error: "잘못된 글꼴 크기 값입니다." },
        { status: 400, headers },
      );
    }

    const blindModeBool = blindMode === "true";

    // 설정 저장
    await saveSetting(client, {
      userId: user.id,
      theme: theme,
      fontSize: fontSize,
      blindMode: blindModeBool,
    });

    return data(
      {
        success: true,
        message: "설정이 성공적으로 저장되었습니다.",
        data: { theme: theme, fontSize: fontSize, blindMode: blindModeBool },
      },
      { headers },
    );
  } catch (error) {
    console.error("설정 API 오류:", error);
    return data(
      {
        error: "서버 오류가 발생했습니다.",
      },
      { status: 500, headers },
    );
  }
}
