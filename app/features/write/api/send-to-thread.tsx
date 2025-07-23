import { type ActionFunctionArgs, data } from "react-router";

import makeServerClient from "~/core/lib/supa-client.server";
import { getThreadsAccessToken } from "~/features/settings/queries";
import {
  getFollowersCount,
  saveUserInsights,
} from "~/features/users/mutations";

import {
  saveThread,
  updateThreadFollowersCount,
  updateThreadResultId,
} from "../mutations";
import {
  processMixedMedia,
  processMultipleMedia,
  processSingleMedia,
} from "../utils/media-processor";

/**
 * Threads API 업로드 처리 로직
 *
 * 6가지 경우의 수 처리:
 * 1. 텍스트만: processSingleMedia()
 * 2. 이미지 1개 + 텍스트: processSingleMedia()
 * 3. 동영상 1개 + 텍스트: processSingleMedia()
 * 4. 이미지 2개 이상 + 텍스트: processMultipleMedia()
 * 5. 동영상 2개 이상 + 텍스트: processMultipleMedia()
 * 6. 이미지 + 동영상 혼합 2개 이상 + 텍스트: processMixedMedia()
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

  // 미디어 파일 정보 파싱
  const mediaFiles = formData.get("mediaFiles") as string;
  let parsedMediaFiles: Array<{
    original_filename: string;
    public_url: string;
    file_size: number;
    mime_type: string;
    storage_path: string;
    media_type: "image" | "video";
  }> = [];

  if (mediaFiles) {
    try {
      parsedMediaFiles = JSON.parse(mediaFiles);
    } catch (error) {
      console.error("Error parsing media files:", error);
    }
  }

  console.log("=== Thread API 호출 정보 ===");
  console.log("텍스트:", text);
  console.log("단일 이미지 URL:", imageUrl);
  console.log("단일 비디오 URL:", videoUrl);
  console.log("다중 이미지 URLs:", imageUrls);
  console.log("다중 비디오 URLs:", videoUrls);
  console.log("미디어 파일 정보:", parsedMediaFiles);

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

  // 미디어 개수 및 타입 분석
  const imageCount =
    (imageUrl ? 1 : 0) + (imageUrls ? imageUrls.split(",").length : 0);
  const videoCount =
    (videoUrl ? 1 : 0) + (videoUrls ? videoUrls.split(",").length : 0);
  const totalMediaCount = imageCount + videoCount;
  const hasImages = imageCount > 0;
  const hasVideos = videoCount > 0;
  const hasMultipleImages = imageCount > 1;
  const hasMultipleVideos = videoCount > 1;
  const hasMixedMedia = hasImages && hasVideos;

  console.log("=== 미디어 분석 결과 ===");
  console.log("이미지 개수:", imageCount);
  console.log("동영상 개수:", videoCount);
  console.log("총 미디어 개수:", totalMediaCount);
  console.log("이미지 있음:", hasImages);
  console.log("동영상 있음:", hasVideos);
  console.log("다중 이미지:", hasMultipleImages);
  console.log("다중 동영상:", hasMultipleVideos);
  console.log("혼합 미디어:", hasMixedMedia);

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
    resultId: "UPLOADING", // 빈 값으로 시작
    profileId: user.id,
    keywords: keywordsArray,
    properties,
  });

  console.log("로컬 DB 저장 완료, thread_id:", localThreadId);

  // 미디어 파일 정보 저장
  if (parsedMediaFiles.length > 0) {
    try {
      console.log("=== 미디어 파일 정보 저장 시작 ===");

      const mediaDataArray = parsedMediaFiles.map((file) => ({
        thread_id: localThreadId,
        profile_id: user.id,
        media_type: file.media_type,
        original_filename: file.original_filename,
        public_url: file.public_url,
        file_size: file.file_size,
        mime_type: file.mime_type,
        storage_path: file.storage_path,
      }));

      // 미디어 파일 정보를 DB에 저장
      const { error: mediaError } = await client
        .from("thread_media")
        .insert(mediaDataArray);

      if (mediaError) {
        console.error("Error saving media files:", mediaError);
      } else {
        console.log(
          `${parsedMediaFiles.length}개의 미디어 파일 정보 저장 완료`,
        );
      }
    } catch (mediaError) {
      console.error("미디어 파일 정보 저장 실패:", mediaError);
      // 미디어 파일 저장 실패는 전체 프로세스를 실패시키지 않음
    }
  }

  // DB 저장 완료 후 즉시 성공 응답 반환
  console.log("=== DB 저장 완료, 즉시 응답 반환 ===");

  // Threads API 호출을 백그라운드에서 비동기로 실행
  (async () => {
    try {
      console.log("=== 백그라운드 Threads API 호출 시작 ===");

      let processingResult: { containerId: string; threadId: string };

      // 6가지 경우의 수에 따른 분기 처리
      if (totalMediaCount === 0) {
        // 1. 텍스트만
        console.log("=== 케이스 1: 텍스트만 ===");
        processingResult = await processSingleMedia(
          snsId,
          text,
          accessToken,
          undefined,
          undefined,
        );
      } else if (totalMediaCount === 1) {
        // 2. 이미지 1개 또는 동영상 1개
        console.log("=== 케이스 2-3: 단일 미디어 ===");
        processingResult = await processSingleMedia(
          snsId,
          text,
          accessToken,
          imageUrl,
          videoUrl,
        );
      } else if (hasMultipleImages && !hasVideos) {
        // 4. 이미지 2개 이상
        console.log("=== 케이스 4: 다중 이미지 ===");
        const allImageUrls = [imageUrl, imageUrls].filter(Boolean).join(",");
        processingResult = await processMultipleMedia(
          snsId,
          text,
          accessToken,
          allImageUrls,
          "image",
        );
      } else if (hasMultipleVideos && !hasImages) {
        // 5. 동영상 2개 이상
        console.log("=== 케이스 5: 다중 동영상 ===");
        const allVideoUrls = [videoUrl, videoUrls].filter(Boolean).join(",");
        processingResult = await processMultipleMedia(
          snsId,
          text,
          accessToken,
          allVideoUrls,
          "video",
        );
      } else if (hasMixedMedia) {
        // 6. 이미지 + 동영상 혼합
        console.log("=== 케이스 6: 혼합 미디어 ===");
        processingResult = await processMixedMedia(
          snsId,
          text,
          accessToken,
          imageUrl,
          videoUrl,
          imageUrls,
          videoUrls,
        );
      } else {
        // 예상치 못한 경우 (fallback)
        console.log("=== 예상치 못한 케이스, 단일 미디어로 처리 ===");
        processingResult = await processSingleMedia(
          snsId,
          text,
          accessToken,
          imageUrl,
          videoUrl,
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

      console.log("백그라운드 로컬 DB 업데이트 완료");

      // 사용자 인사이트 저장 (백그라운드에서 실행)
      try {
        console.log("=== 백그라운드 사용자 인사이트 저장 시작 ===");

        // 인사이트 데이터 직접 가져오기
        const { fetchUserInsights } = await import(
          "~/features/users/utils/insights-utils"
        );
        const insightsData = await fetchUserInsights(client, user.id);

        if (insightsData.success && insightsData.data) {
          // 팔로워 수 업데이트
          const followersCount = await getFollowersCount(
            insightsData.data.data,
          );
          await updateThreadFollowersCount(
            client,
            localThreadId,
            followersCount,
          );

          // 모든 인사이트 데이터 저장 (시계열 + 총계)
          await saveUserInsights(
            client,
            user.id,
            localThreadId,
            insightsData.data.data,
          );

          console.log("백그라운드 사용자 인사이트 저장 완료");
        }
      } catch (insightsError) {
        console.error("백그라운드 사용자 인사이트 저장 실패:", insightsError);
        // 인사이트 저장 실패는 전체 프로세스를 실패시키지 않음
      }
    } catch (error) {
      console.error("백그라운드 Threads API 호출 실패:", error);

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
    }
  })();

  // 즉시 성공 응답 반환 (사용자는 목록으로 이동)
  return data(
    {
      success: true,
      localThreadId,
      message:
        "홍보글이 저장되었습니다. Threads 업로드가 백그라운드에서 진행 중입니다.",
    },
    { status: 200 },
  );
}
