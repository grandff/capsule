export interface UploadedFile {
  id: string;
  file: File;
  type: "image" | "video";
  preview: string;
  size: number;
  name: string;
  uploadedUrl?: string; // Supabase storage URL
  isUploaded?: boolean; // 업로드 완료 여부
}

// 파일 제한 설정
export const FILE_LIMITS = {
  MAX_FILES: 20,
  MAX_IMAGE_SIZE: 8 * 1024 * 1024, // 8MB
  MAX_VIDEO_SIZE: 1024 * 1024 * 1024, // 1GB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png"],
  ALLOWED_VIDEO_TYPES: ["video/mp4", "video/quicktime"],
} as const;

// 파일을 API를 통해 Supabase Storage에 업로드
export async function uploadFileToStorage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/write/upload-media", {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "파일 업로드 실패");
  }

  if (!result.success) {
    throw new Error(result.error || "파일 업로드 실패");
  }

  return result.url;
}

// 파일 크기 포맷팅
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// 파일 유효성 검사
export function validateFile(
  file: File,
  currentFileCount: number,
): { isValid: boolean; error?: string } {
  // 파일 개수 체크
  if (currentFileCount >= FILE_LIMITS.MAX_FILES) {
    return {
      isValid: false,
      error: `최대 ${FILE_LIMITS.MAX_FILES}개까지만 업로드 가능합니다.`,
    };
  }

  // 파일 타입 체크
  const isImage = FILE_LIMITS.ALLOWED_IMAGE_TYPES.includes(file.type as any);
  const isVideo = FILE_LIMITS.ALLOWED_VIDEO_TYPES.includes(file.type as any);

  if (!isImage && !isVideo) {
    return {
      isValid: false,
      error:
        "지원하지 않는 파일 형식입니다. (이미지: JPG, PNG / 동영상: MP4, MOV)",
    };
  }

  // 파일 크기 체크
  const maxSize = isImage
    ? FILE_LIMITS.MAX_IMAGE_SIZE
    : FILE_LIMITS.MAX_VIDEO_SIZE;
  if (file.size > maxSize) {
    const maxSizeMB = isImage ? "8MB" : "1GB";
    return {
      isValid: false,
      error: `${file.name} 파일이 너무 큽니다. 최대 ${maxSizeMB}까지 가능합니다.`,
    };
  }

  return { isValid: true };
}

// 파일 객체 생성
export function createUploadedFile(file: File): UploadedFile {
  const fileId = Date.now() + Math.random().toString(36).substr(2, 9);
  const isImage = FILE_LIMITS.ALLOWED_IMAGE_TYPES.includes(file.type as any);
  const fileType = isImage ? "image" : "video";
  const preview = URL.createObjectURL(file);

  return {
    id: fileId,
    file,
    type: fileType,
    preview,
    size: file.size,
    name: file.name,
    isUploaded: false,
  };
}

// 파일 삭제
export async function deleteFileFromStorage(filePath: string): Promise<void> {
  const formData = new FormData();
  formData.append("filePath", filePath);

  const response = await fetch("/api/write/delete-media", {
    method: "DELETE",
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "파일 삭제 실패");
  }
}

// URL에서 파일 경로 추출
export function extractFilePathFromUrl(url: string): string {
  const urlParts = url.split("/");
  return urlParts.slice(-4).join("/"); // userId/yyyy/mm/dd/filename
}
