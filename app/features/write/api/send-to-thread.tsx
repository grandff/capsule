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
  processMultipleMedia,
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

  // 미디어 개수에 따른 분기 처리
  const hasMultipleImages = imageUrls && imageUrls.split(",").length > 1;
  const hasMultipleVideos = videoUrls && videoUrls.split(",").length > 1;
  const hasMultipleMedia = hasMultipleImages || hasMultipleVideos;

  console.log("=== 미디어 처리 분기 ===");
  console.log("다중 이미지:", hasMultipleImages);
  console.log("다중 비디오:", hasMultipleVideos);
  console.log("다중 미디어:", hasMultipleMedia);

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

      // 미디어 처리 분기
      if (hasMultipleMedia) {
        // 다중 미디어 처리
        console.log("=== 다중 미디어 처리 시작 ===");
        if (hasMultipleImages) {
          processingResult = await processMultipleMedia(
            snsId,
            text,
            accessToken,
            imageUrls!,
            "image",
          );
        } else {
          processingResult = await processMultipleMedia(
            snsId,
            text,
            accessToken,
            videoUrls!,
            "video",
          );
        }
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
          // 모든 인사이트 데이터 저장 (시계열 + 총계)
          await saveUserInsights(
            client,
            user.id,
            localThreadId,
            insightsData.data.data,
          );

          // 팔로워 수 업데이트
          const followersCount = await getFollowersCount(
            insightsData.data.data,
          );
          await updateThreadFollowersCount(
            client,
            localThreadId,
            followersCount,
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
