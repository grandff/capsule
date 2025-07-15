import type { LoaderFunctionArgs } from "react-router";

import makeServerClient from "~/core/lib/supa-client.server";
import { getUserList } from "~/features/users/queries";
import { validatePerplexityCronSecret } from "~/utils/cron-validation";
import { gptCompletion } from "~/utils/gpt-util";

import { getRecentThreads } from "../queries";
import { getAnalysisPrompt } from "./prompts";

export async function loader({ request }: LoaderFunctionArgs) {
  // 1. 헤더 검증 (cronjob에서만 호출 가능) - 로컬 개발 환경에서는 건너뛰기
  const isLocalDev =
    process.env.NODE_ENV === "development" && !process.env.VERCEL;
  if (!isLocalDev && !validatePerplexityCronSecret(request)) {
    return new Response("Forbidden", { status: 403 });
  }

  const [client, headers] = makeServerClient(request);

  // 2. 현재 사용자 목록 조회
  const userList = await getUserList(client);

  // 3. 사용자 별로 쓰레드 분석 시작
  for (const user of userList) {
    try {
      const recentThreads = await getRecentThreads(client, user.profile_id);

      // 3-1. 최근 작성 여부 체크 (어제 날짜 기준)
      if (recentThreads.length === 0) {
        console.log(`사용자 ${user.profile_id}: 쓰레드가 없어서 분석 건너뜀`);
        continue;
      }

      const latestThread = recentThreads[0];
      const latestDate = new Date(latestThread.created_at);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      // 어제 날짜와 최근 쓰레드 날짜 비교 (시간 제외하고 날짜만)
      const isRecent =
        latestDate.toDateString() === yesterday.toDateString() ||
        latestDate.toDateString() === new Date().toDateString();

      if (!isRecent) {
        console.log(
          `사용자 ${user.profile_id}: 최근에 작성된 쓰레드가 없어서 분석 건너뜀 (최근: ${latestDate.toDateString()})`,
        );
        continue;
      }

      // 3-2. 프롬프트 텍스트 치환
      let prompt = getAnalysisPrompt();

      // text1 ~ text5 치환
      for (let i = 1; i <= 3; i++) {
        const threadIndex = i - 1;
        const threadText = recentThreads[threadIndex]?.thread || "데이터없음";
        prompt = prompt.replace(`{{text${i}}}`, threadText);
      }

      // 3-3. GPT 호출
      console.log(prompt);
      console.log(`사용자 ${user.profile_id} 분석 시작...`);
      const analysisResult = await gptCompletion(prompt);

      if (analysisResult) {
        console.log(`사용자 ${user.profile_id} 분석 결과:`, analysisResult);
      } else {
        console.log(`사용자 ${user.profile_id}: GPT 분석 실패`);
      }
    } catch (error) {
      console.error(`사용자 ${user.profile_id} 분석 중 오류:`, error);
    }
  }

  return new Response("Analysis completed", { status: 200 });
}
