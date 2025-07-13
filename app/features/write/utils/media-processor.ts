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

// 다중 이미지 처리
export const processMultipleImages = async (
  snsId: string,
  text: string,
  accessToken: string,
  imageUrls: string,
): Promise<MediaProcessingResult> => {
  const imageUrlArray = imageUrls.split(",");
  console.log(`다중 이미지 처리: ${imageUrlArray.length}개`);

  // 각 이미지별로 개별 컨테이너 생성
  const containerIds: string[] = [];
  for (let i = 0; i < imageUrlArray.length; i++) {
    const imageUrl = imageUrlArray[i].trim();
    const isCarouselItem = i > 0; // 첫 번째가 아닌 경우 carousel item

    console.log(`이미지 ${i + 1}/${imageUrlArray.length} 처리:`, imageUrl);

    const { id: singleContainerId } = await threadsSingleMedia(
      snsId,
      text,
      accessToken,
      imageUrl,
      "image",
      isCarouselItem,
    );

    containerIds.push(singleContainerId);
  }

  // Carousel 컨테이너 생성
  console.log("Carousel 컨테이너 생성 시작");
  const { id: carouselContainerId } = await threadsCarousel(
    snsId,
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

// 다중 비디오 처리
export const processMultipleVideos = async (
  snsId: string,
  text: string,
  accessToken: string,
  videoUrls: string,
): Promise<MediaProcessingResult> => {
  const videoUrlArray = videoUrls.split(",");
  console.log(`다중 비디오 처리: ${videoUrlArray.length}개`);

  // 각 비디오별로 개별 컨테이너 생성
  const containerIds: string[] = [];
  for (let i = 0; i < videoUrlArray.length; i++) {
    const videoUrl = videoUrlArray[i].trim();
    const isCarouselItem = i > 0; // 첫 번째가 아닌 경우 carousel item

    console.log(`비디오 ${i + 1}/${videoUrlArray.length} 처리:`, videoUrl);

    const { id: singleContainerId } = await threadsSingleMedia(
      snsId,
      text,
      accessToken,
      videoUrl,
      "video",
      isCarouselItem,
    );

    containerIds.push(singleContainerId);
  }

  // Carousel 컨테이너 생성
  console.log("Carousel 컨테이너 생성 시작");
  const { id: carouselContainerId } = await threadsCarousel(
    snsId,
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
