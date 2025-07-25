import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";

import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
} from "~/constants";

// 클라이언트용 Supabase 클라이언트 생성
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase 환경 변수가 설정되지 않았습니다!");
  console.error("VITE_SUPABASE_URL:", supabaseUrl);
  console.error(
    "VITE_SUPABASE_ANON_KEY:",
    supabaseAnonKey ? "설정됨" : "설정되지 않음",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

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
  MAX_IMAGE_SIZE: MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE: MAX_VIDEO_SIZE,
  ALLOWED_IMAGE_TYPES: ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES: ALLOWED_VIDEO_TYPES,
} as const;

// 파일을 Supabase Storage에 직접 업로드 (클라이언트에서)
export async function uploadFileToStorage(
  file: File,
  userId: string,
): Promise<string> {
  try {
    console.log("=== 파일 업로드 시작 ===");
    console.log("파일명:", file.name);
    console.log("파일 크기:", file.size, "bytes");
    console.log("파일 타입:", file.type);
    console.log("사용자 ID:", userId);

    // 올바른 버킷 구조: {user.id}/{year}/{month}/{day}/{fileName}
    const today = new Date();
    const year = today.getFullYear().toString();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const fullPath = `${userId}/${year}/${month}/${day}/${fileName}`;

    console.log(`파일 업로드 경로: ${fullPath}`);

    // Supabase Storage에 직접 업로드
    console.log("Supabase Storage 업로드 시작...");
    const { data, error } = await supabase.storage
      .from("upload-medias")
      .upload(fullPath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      throw new Error(error.message || "파일 업로드에 실패했습니다.");
    }

    console.log("업로드 성공! 데이터:", data);

    // 공개 URL 생성
    const { data: urlData } = supabase.storage
      .from("upload-medias")
      .getPublicUrl(fullPath);

    console.log("공개 URL 생성:", urlData.publicUrl);

    return urlData.publicUrl;
  } catch (error) {
    console.error("Upload file to storage error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "파일 업로드 실패";
    throw new Error(errorMessage);
  }
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
  try {
    const { error } = await supabase.storage
      .from("upload-medias")
      .remove([filePath]);

    if (error) {
      throw new Error(error.message || "파일 삭제 실패");
    }
  } catch (error) {
    console.error("Delete file from storage error:", error);
    throw new Error(error instanceof Error ? error.message : "파일 삭제 실패");
  }
}

// URL에서 파일 경로 추출
export function extractFilePathFromUrl(url: string): string {
  const urlParts = url.split("/");
  return urlParts.slice(-4).join("/"); // userId/yyyy/mm/dd/filename
}
