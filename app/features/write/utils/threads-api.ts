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

  console.log(`단일 ${mediaType} 컨테이너 생성:`, mediaUrl);
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

// 단일/텍스트용 쓰레드 컨테이너 생성
export const threads = async (
  userId: string,
  text: string,
  accessToken: string,
  imageUrl?: string,
  videoUrl?: string,
  imageUrls?: string,
  videoUrls?: string,
) => {
  const formData = new FormData();

  // 미디어 타입 결정
  let mediaType = "TEXT";
  if (videoUrl || videoUrls) {
    mediaType = "VIDEO";
  } else if (imageUrl || imageUrls) {
    mediaType = "IMAGE";
  }

  formData.append("media_type", mediaType);
  formData.append("image_url", imageUrl || "");
  formData.append("video_url", videoUrl || "");

  // 다중 파일 처리
  if (imageUrls) {
    formData.append("image_urls", imageUrls);
    console.log("다중 이미지 URLs 추가:", imageUrls);
  }
  if (videoUrls) {
    formData.append("video_urls", videoUrls);
    console.log("다중 비디오 URLs 추가:", videoUrls);
  }

  formData.append("text", text);
  formData.append("access_token", accessToken);

  console.log("userId", userId);
  console.log("accessToken", accessToken);
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
