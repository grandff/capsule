import { type ActionFunctionArgs, data } from "react-router";

import makeServerClient from "~/core/lib/supa-client.server";
import { getThreadsAccessToken } from "~/features/settings/queries";

import { saveThread, updateThreadResultId } from "../mutations";
import {
  processMultipleImages,
  processMultipleVideos,
  processSingleMedia,
} from "../utils/media-processor";

/**
 * Threads API 업로드 처리 로직
 *
 * 처리 순서:
 * 1. 미디어 개수 확인 및 분기 처리
 *    ├─ 단일 미디어 또는 텍스트만: processSingleMedia() 사용
 *    └─ 다중 미디어 (2개 이상):
 *        ├─ 다중 이미지: processMultipleImages() 사용
 *        └─ 다중 비디오: processMultipleVideos() 사용
 *
 * 2. 다중 미디어 처리 과정:
 *    a) 각 미디어별로 개별 컨테이너 생성 (is_carousel_item=true)
 *    b) 모든 컨테이너 ID를 children으로 Carousel 컨테이너 생성
 *    c) Carousel 컨테이너로 게시
 *
 * 3. 단일 미디어 처리 과정:
 *    a) 기존 threads() 함수로 컨테이너 생성
 *    b) threadsPublish() 함수로 게시
 *
 * 4. 데이터베이스 처리:
 *    a) 로컬 DB에 먼저 저장 (resultId 빈 값)
 *    b) Threads API 호출 후 resultId 업데이트
 *    c) 실패 시 에러 상태로 표시
 *
 * 5. 사용자 인사이트 저장:
 *    a) Threads 업로드 완료 후 사용자 인사이트 가져오기
 *    b) 시계열 데이터와 총계 데이터를 DB에 저장
 */
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const text = formData.get("text") as string;
  const shortText = formData.get("shortText") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const videoUrl = formData.get("videoUrl") as string;
  const imageUrls = formData.get("imageUrls") as string;
  const videoUrls = formData.get("videoUrls") as string;
  const keywords = formData.get("keywords") as string;
  const moods = formData.get("moods") as string;
  const intents = formData.get("intents") as string;

  console.log("=== Thread API 호출 정보 ===");
  console.log("텍스트:", text);
  console.log("단일 이미지 URL:", imageUrl);
  console.log("단일 비디오 URL:", videoUrl);
  console.log("다중 이미지 URLs:", imageUrls);
  console.log("다중 비디오 URLs:", videoUrls);

  // 로그인한 사용자 정보 가져오기
  const [client] = makeServerClient(request);
  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    return data({ error: "User not found" }, { status: 401 });
  }

  // 토큰 정보 가져오기
  const { accessToken, expiresAt, snsId } = await getThreadsAccessToken(
    client,
    user.id,
  );

  if (!accessToken) {
    return data({ error: "Access token not found" }, { status: 401 });
  }

  // 파일 개수에 따른 분기 처리
  const hasSingleImage = imageUrl && !imageUrls;
  const hasSingleVideo = videoUrl && !videoUrls;
  const hasMultipleImages = imageUrls && imageUrls.split(",").length > 0;
  const hasMultipleVideos = videoUrls && videoUrls.split(",").length > 0;

  console.log("=== 파일 처리 분기 ===");
  console.log("단일 이미지:", hasSingleImage);
  console.log("단일 비디오:", hasSingleVideo);
  console.log("다중 이미지:", hasMultipleImages);
  console.log("다중 비디오:", hasMultipleVideos);

  // 미디어 처리 분기 (백그라운드에서만 실행)
  let processingResult: { containerId: string; threadId: string };

  // 키워드와 속성 데이터 파싱
  const keywordsArray = keywords ? keywords.split(",") : [];
  const moodsArray = moods ? moods.split(",") : [];
  const intentsArray = intents ? intents.split(",") : [];

  // 속성 데이터 구성
  const properties = [
    ...moodsArray.map((mood) => ({
      property: mood,
      propertyType: "mood" as const,
    })),
    ...intentsArray.map((intent) => ({
      property: intent,
      propertyType: "work" as const,
    })),
  ];

  // 먼저 로컬 DB에 저장 (resultId는 빈 값으로)
  const localThreadId = await saveThread(client, {
    shortText,
    thread: text,
    targetType: "thread",
    sendFlag: false, // 아직 전송되지 않음
    resultId: "", // 빈 값으로 시작
    profileId: user.id,
    keywords: keywordsArray,
    properties,
  });

  console.log("로컬 DB 저장 완료, thread_id:", localThreadId);

  // Threads API 호출 (백그라운드에서 실행)
  try {
    // 미디어 처리 분기
    if (hasMultipleImages) {
      // 다중 이미지 처리
      console.log("=== 다중 이미지 처리 시작 ===");
      processingResult = await processMultipleImages(
        snsId,
        text,
        accessToken,
        imageUrls!,
      );
    } else if (hasMultipleVideos) {
      // 다중 비디오 처리
      console.log("=== 다중 비디오 처리 시작 ===");
      processingResult = await processMultipleVideos(
        snsId,
        text,
        accessToken,
        videoUrls!,
      );
    } else {
      // 단일 미디어 또는 텍스트만 있는 경우
      console.log("=== 단일 미디어 또는 텍스트 처리 ===");
      processingResult = await processSingleMedia(
        snsId,
        text,
        accessToken,
        imageUrl,
        videoUrl,
        imageUrls,
        videoUrls,
      );
    }

    const { threadId: bgThreadId } = processingResult;

    console.log("Threads API 호출 성공, threadId:", bgThreadId);

    // 성공 시 로컬 DB 업데이트
    await updateThreadResultId(client, localThreadId, bgThreadId);

    // send_flag도 true로 업데이트
    const { error: updateError } = await client
      .from("threads")
      .update({ send_flag: true })
      .eq("thread_id", localThreadId);

    if (updateError) {
      console.error("Error updating send_flag:", updateError);
    }

    console.log("로컬 DB 업데이트 완료");

    // 사용자 인사이트 저장 (백그라운드에서 실행)
    try {
      console.log("=== 사용자 인사이트 저장 시작 ===");

      // 인사이트 API 호출
      const insightsResponse = await fetch("/api/users/get-user-insights", {
        method: "POST",
      });

      if (insightsResponse.ok) {
        const insightsData = await insightsResponse.json();

        if (insightsData.success) {
          // 시계열 데이터 저장
          if (insightsData.timeseries?.data) {
            for (const insight of insightsData.timeseries.data) {
              if (insight.values) {
                for (const value of insight.values) {
                  await client.from("user_insights").insert({
                    profile_id: user.id,
                    thread_id: localThreadId,
                    metric_name: insight.name,
                    metric_type: "timeseries",
                    period: insight.period,
                    value: value.value,
                    end_time: new Date(value.end_time).toISOString(),
                  });
                }
              }
            }
          }

          // 총계 데이터 저장/업데이트
          if (insightsData.total?.data) {
            for (const metric of insightsData.total.data) {
              if (metric.total_value) {
                await client.from("user_metrics").upsert(
                  {
                    profile_id: user.id,
                    metric_name: `total_${metric.name}`,
                    total_value: metric.total_value.value,
                    last_updated: new Date().toISOString(),
                  },
                  {
                    onConflict: "profile_id,metric_name",
                  },
                );
              }
            }
          }

          console.log("사용자 인사이트 저장 완료");
        }
      }
    } catch (insightsError) {
      console.error("사용자 인사이트 저장 실패:", insightsError);
      // 인사이트 저장 실패는 전체 프로세스를 실패시키지 않음
    }

    return data(
      {
        success: true,
        localThreadId,
        threadId: bgThreadId,
        message: "Threads에 성공적으로 업로드되었습니다.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Threads API 호출 실패:", error);

    // 실패 시에도 로컬 DB는 유지하되 에러 상태로 표시
    const { error: updateError } = await client
      .from("threads")
      .update({
        send_flag: false,
        result_id: "ERROR",
      })
      .eq("thread_id", localThreadId);

    if (updateError) {
      console.error("Error updating error status:", updateError);
    }

    return data(
      {
        success: false,
        localThreadId,
        error: "Threads 업로드에 실패했습니다. 나중에 다시 시도해주세요.",
        message: "로컬에 저장되었지만 Threads 업로드에 실패했습니다.",
      },
      { status: 500 },
    );
  }
}
