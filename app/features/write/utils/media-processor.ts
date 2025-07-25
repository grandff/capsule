import { retryWithDelay } from "./retry-utils";
import {
  threads,
  threadsCarousel,
  threadsPublish,
  threadsSingleMedia,
} from "./threads-api";

// 미디어 처리 결과 타입
export interface MediaProcessingResult {
  containerId: string;
  threadId: string;
}

// 다중 미디어 처리 (이미지 또는 동영상 2개 이상)
export const processMultipleMedia = async (
  snsId: string,
  text: string,
  accessToken: string,
  mediaUrls: string,
  mediaType: "image" | "video",
): Promise<MediaProcessingResult> => {
  const mediaUrlArray = mediaUrls.split(",");

  // 각 미디어별로 개별 컨테이너 생성
  const containerIds: string[] = [];
  for (let i = 0; i < mediaUrlArray.length; i++) {
    const mediaUrl = mediaUrlArray[i].trim();
    const isCarouselItem = i > 0; // 첫 번째가 아닌 경우 carousel item

    console.log(
      `${mediaType} ${i + 1}/${mediaUrlArray.length} 처리:`,
      mediaUrl,
    );

    const { id: singleContainerId } = await threadsSingleMedia(
      snsId,
      text,
      accessToken,
      mediaUrl,
      mediaType,
      isCarouselItem,
    );

    containerIds.push(singleContainerId);
  }

  // Carousel 컨테이너 생성 (재시도 로직 포함)
  console.log("Carousel 컨테이너 생성 시작");
  const { id: carouselContainerId } = await retryWithDelay(async () => {
    return await threadsCarousel(snsId, text, accessToken, containerIds);
  });

  // Carousel 게시 (재시도 로직 포함)
  const { id: threadId } = await retryWithDelay(async () => {
    return await threadsPublish(snsId, carouselContainerId, accessToken);
  });

  return { containerId: carouselContainerId, threadId };
};

// 이미지와 동영상 혼합 미디어 처리 (Case 2: 4,5,6번 케이스용)
export const processMixedMedia = async (
  snsId: string,
  text: string,
  accessToken: string,
  imageUrl?: string,
  videoUrl?: string,
  imageUrls?: string,
  videoUrls?: string,
): Promise<MediaProcessingResult> => {
  console.log("=== 혼합 미디어 처리 시작 ===");

  // 모든 미디어 URL을 수집
  const allImageUrls: string[] = [];
  const allVideoUrls: string[] = [];

  // 단일 이미지 추가
  if (imageUrl) {
    allImageUrls.push(imageUrl);
  }

  // 다중 이미지 추가
  if (imageUrls) {
    allImageUrls.push(...imageUrls.split(",").map((url) => url.trim()));
  }

  // 단일 동영상 추가
  if (videoUrl) {
    allVideoUrls.push(videoUrl);
  }

  // 다중 동영상 추가
  if (videoUrls) {
    allVideoUrls.push(...videoUrls.split(",").map((url) => url.trim()));
  }

  console.log("수집된 이미지 URLs:", allImageUrls);
  console.log("수집된 동영상 URLs:", allVideoUrls);

  // 모든 미디어를 순서대로 처리 (이미지 먼저, 그 다음 동영상)
  const allMedia = [
    ...allImageUrls.map((url) => ({ url, type: "image" as const })),
    ...allVideoUrls.map((url) => ({ url, type: "video" as const })),
  ];

  // 각 미디어별로 개별 컨테이너 생성
  const containerIds: string[] = [];
  for (let i = 0; i < allMedia.length; i++) {
    const { url, type } = allMedia[i];
    const isCarouselItem = i > 0; // 첫 번째가 아닌 경우 carousel item

    const { id: singleContainerId } = await threadsSingleMedia(
      snsId,
      text,
      accessToken,
      url,
      type,
      isCarouselItem,
    );

    containerIds.push(singleContainerId);
  }

  // Carousel 컨테이너 생성 (재시도 로직 포함)
  console.log("혼합 미디어 Carousel 컨테이너 생성 시작");
  const { id: carouselContainerId } = await retryWithDelay(async () => {
    return await threadsCarousel(snsId, text, accessToken, containerIds);
  });

  // Carousel 게시 (재시도 로직 포함)
  const { id: threadId } = await retryWithDelay(async () => {
    return await threadsPublish(snsId, carouselContainerId, accessToken);
  });

  return { containerId: carouselContainerId, threadId };
};

// 단일 미디어 또는 텍스트 처리 (Case 1: 1,2,3번 케이스용)
export const processSingleMedia = async (
  snsId: string,
  text: string,
  accessToken: string,
  imageUrl?: string,
  videoUrl?: string,
): Promise<MediaProcessingResult> => {
  console.log("=== 단일 미디어 또는 텍스트 처리 ===");
  console.log("imageUrl:", imageUrl);
  console.log("videoUrl:", videoUrl);

  // 컨테이너 생성
  const { id: containerId } = await threads(
    snsId,
    text,
    accessToken,
    imageUrl,
    videoUrl,
  );

  // 게시 (재시도 로직 포함)
  const { id: threadId } = await retryWithDelay(async () => {
    return await threadsPublish(snsId, containerId, accessToken);
  });

  return { containerId, threadId };
};
