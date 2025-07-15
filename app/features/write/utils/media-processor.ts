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
  console.log(`다중 ${mediaType} 처리: ${mediaUrlArray.length}개`);

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

  // Carousel 컨테이너 생성
  console.log("Carousel 컨테이너 생성 시작");
  const { id: carouselContainerId } = await threadsCarousel(
    snsId,
    text,
    accessToken,
    containerIds,
  );

  // Carousel 게시
  const { id: threadId } = await threadsPublish(
    snsId,
    carouselContainerId,
    accessToken,
  );

  return { containerId: carouselContainerId, threadId };
};

// 단일 미디어 또는 텍스트 처리
export const processSingleMedia = async (
  snsId: string,
  text: string,
  accessToken: string,
  imageUrl?: string,
  videoUrl?: string,
  imageUrls?: string,
  videoUrls?: string,
): Promise<MediaProcessingResult> => {
  console.log("=== 단일 미디어 또는 텍스트 처리 ===");

  // 컨테이너 생성
  const { id: containerId } = await threads(
    snsId,
    text,
    accessToken,
    imageUrl,
    videoUrl,
    imageUrls,
    videoUrls,
  );

  // 게시
  const { id: threadId } = await threadsPublish(
    snsId,
    containerId,
    accessToken,
  );

  return { containerId, threadId };
};
