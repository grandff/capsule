import { data } from "react-router";

import makeServerClient from "~/core/lib/supa-client.server";

import { updateIsFirstLogin } from "../mutations";
import { analyzeUserTrend } from "../utils/trend-analysis";

export async function action({ request }: { request: Request }) {
  if (request.method !== "POST") {
    return data(
      { success: false, message: "Method not allowed" },
      { status: 405 },
    );
  }

  try {
    const [client] = makeServerClient(request);

    // 현재 사용자 확인
    const {
      data: { user },
      error: authError,
    } = await client.auth.getUser();

    if (authError || !user) {
      return data(
        { success: false, message: "인증이 필요합니다." },
        { status: 401 },
      );
    }

    // 요청 본문 파싱
    const body = await request.json();
    const { isFirstLogin } = body;

    if (typeof isFirstLogin !== "boolean") {
      return data(
        { success: false, message: "유효하지 않은 데이터입니다." },
        { status: 400 },
      );
    }

    // 최초 접속 여부 업데이트
    await updateIsFirstLogin(client, user.id, isFirstLogin);

    // 최초 로그인인 경우 트렌드 분석 수행
    if (isFirstLogin === false) {
      try {
        console.log(`사용자 ${user.id} 최초 로그인 완료 - 트렌드 분석 시작`);
        const trendResult = await analyzeUserTrend(client, user.id);

        if (trendResult.success) {
          console.log(`사용자 ${user.id} 트렌드 분석 완료`);
        } else {
          console.warn(
            `사용자 ${user.id} 트렌드 분석 실패:`,
            trendResult.error,
          );
          // 트렌드 분석 실패는 전체 요청을 실패시키지 않음
        }
      } catch (trendError) {
        console.error(`사용자 ${user.id} 트렌드 분석 중 오류:`, trendError);
        // 트렌드 분석 오류는 전체 요청을 실패시키지 않음
      }
    }

    return data({ success: true, message: "업데이트가 완료되었습니다." });
  } catch (error) {
    console.error("Error updating first login status:", error);
    return data(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
