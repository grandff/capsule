/**
 *
 * 단일 미디어의 경우 : threads() -> threadsPublish()
 * 다중 미디어인 경우 : threadsSingleMedia() -> threadsCarousel() -> threadsPublish()
 *
 */

const THREAD_END_POINT_URL = "https://graph.threads.net/v1.0";

// 단일 미디어용 쓰레드 컨테이너 생성 (다중 미디어용)
export const threadsSingleMedia = async (
  userId: string,
  text: string,
  accessToken: string,
  mediaUrl: string,
  mediaType: "image" | "video",
  isCarouselItem: boolean = false,
) => {
  const formData = new FormData();

  // 미디어 타입에 따른 파라미터 설정
  if (mediaType === "image") {
    formData.append("image_url", mediaUrl);
    formData.append("media_type", "IMAGE");
  } else {
    formData.append("video_url", mediaUrl);
    formData.append("media_type", "VIDEO");
  }

  // Carousel 아이템인 경우 플래그 추가
  if (isCarouselItem) {
    formData.append("is_carousel_item", "true");
  }

  formData.append("access_token", accessToken);

  console.log("Carousel 아이템:", isCarouselItem);

  const response = await fetch(`${THREAD_END_POINT_URL}/${userId}/threads`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  console.log("단일 미디어 컨테이너 응답:", data);
  return data; // return thread media container Id
};

// Carousel 컨테이너 생성 (다중 미디어용)
export const threadsCarousel = async (
  userId: string,
  text: string,
  accessToken: string,
  childrenIds: string[],
) => {
  const formData = new FormData();

  formData.append("media_type", "CAROUSEL");
  formData.append("text", text);
  formData.append("children", childrenIds.join(","));
  formData.append("access_token", accessToken);

  console.log("Carousel 컨테이너 생성:", childrenIds);
  console.log("Carousel 텍스트:", text);

  const response = await fetch(`${THREAD_END_POINT_URL}/${userId}/threads`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  console.log("Carousel 컨테이너 응답:", data);
  return data; // return carousel container Id
};

// 단일/텍스트용 쓰레드 컨테이너 생성 (Case 1: 1,2,3번 케이스용)
export const threads = async (
  userId: string,
  text: string,
  accessToken: string,
  imageUrl?: string,
  videoUrl?: string,
) => {
  const formData = new FormData();

  // 미디어 타입 결정
  let mediaType = "TEXT";
  if (videoUrl) {
    mediaType = "VIDEO";
  } else if (imageUrl) {
    mediaType = "IMAGE";
  }

  formData.append("media_type", mediaType);

  if (imageUrl) {
    formData.append("image_url", imageUrl);
  }
  if (videoUrl) {
    formData.append("video_url", videoUrl);
  }

  formData.append("text", text);
  formData.append("access_token", accessToken);

  console.log("userId", userId);
  console.log("accessToken", accessToken);

  console.log("imageUrl", imageUrl);
  console.log("videoUrl", videoUrl);

  const response = await fetch(`${THREAD_END_POINT_URL}/${userId}/threads`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  console.log("data", data);
  return data; // return thread media container Id
};

// 쓰레드 게시
export const threadsPublish = async (
  userId: string,
  containerId: string,
  accessToken: string,
) => {
  const formData = new FormData();
  formData.append("creation_id", containerId);
  formData.append("access_token", accessToken);

  const response = await fetch(
    `${THREAD_END_POINT_URL}/${userId}/threads_publish`,
    {
      method: "POST",
      body: formData,
    },
  );

  const data = await response.json();
  console.log("Threads publish 응답:", data);
  return data; // return thread media Id
};
