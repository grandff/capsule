import type { UploadedFile } from "./file-upload-utils";

import { toast } from "react-toastify";

import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  SHORT_TOAST_DURATION,
} from "~/constants";

import {
  extractFilePathFromUrl,
  uploadFileToStorage,
} from "./file-upload-utils";

// 복사 핸들러
export async function handleCopy(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("홍보글이 클립보드에 복사되었습니다!", {
      autoClose: SHORT_TOAST_DURATION,
    });
    return true;
  } catch (error) {
    toast.error("복사에 실패했습니다.", {
      autoClose: SHORT_TOAST_DURATION,
    });
    return false;
  }
}

// 파일 업로드 핸들러
export async function handleFileUpload(
  files: FileList,
  uploadedFiles: UploadedFile[],
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>,
  setUploadError: (error: string) => void,
  setIsFileUploading: (uploading: boolean) => void,
  userId: string, // userId 매개변수 추가
): Promise<void> {
  console.log("사용자 ID:", userId);

  if (!files) {
    console.log("파일이 선택되지 않았습니다.");
    return;
  }

  if (!userId) {
    console.error("사용자 ID가 없습니다!");
    setUploadError("사용자 인증이 필요합니다. 다시 로그인해주세요.");
    return;
  }

  setUploadError("");

  // 파일 개수 체크 (최대 10개)
  if (uploadedFiles.length + files.length > 10) {
    const errorMsg = "최대 10개까지만 업로드 가능합니다.";
    console.error(errorMsg);
    setUploadError(errorMsg);
    return;
  }

  // 임시로 파일들을 추가 (업로드 전)
  const newFiles: UploadedFile[] = [];

  Array.from(files).forEach((file) => {
    console.log(
      `파일 처리 중: ${file.name} (${file.type}, ${file.size} bytes)`,
    );

    // 파일 타입 확인 (이미지 파일만 허용)
    const isImage = ALLOWED_IMAGE_TYPES.some(
      (type) =>
        type === file.type ||
        (type.endsWith("/*") && file.type.startsWith(type.slice(0, -2))),
    );
    console.log("isImage", isImage);

    if (!isImage) {
      const errorMsg =
        "지원하지 않는 파일 형식입니다. (이미지 파일만 업로드 가능)";
      console.error(errorMsg);
      setUploadError(errorMsg);
      return;
    }

    // 파일 크기 체크 (이미지: 6MB)
    const maxSize = 6 * 1024 * 1024;
    if (file.size > maxSize) {
      const errorMsg = `${file.name} 파일이 너무 큽니다. 최대 6MB까지 가능합니다.`;
      console.error(errorMsg);
      setUploadError(errorMsg);
      return;
    }

    // 파일 추가
    const fileId = Date.now() + Math.random().toString(36).substr(2, 9);
    const fileType = "image";

    // 미리보기 URL 생성
    const preview = URL.createObjectURL(file);

    const newFile: UploadedFile = {
      id: fileId,
      file,
      type: fileType,
      preview,
      size: file.size,
      name: file.name,
      isUploaded: false,
    };

    newFiles.push(newFile);
  });

  if (newFiles.length === 0) {
    console.log("업로드할 유효한 파일이 없습니다.");
    return;
  }

  // 파일들을 상태에 추가
  setUploadedFiles([...uploadedFiles, ...newFiles]);

  // 파일 업로드 시작
  setIsFileUploading(true);
  console.log("파일 업로드 시작...");

  // 각 파일을 Supabase Storage에 직접 업로드
  for (const file of newFiles) {
    try {
      const uploadedUrl = await uploadFileToStorage(file.file, userId);

      // 업로드 완료된 파일 업데이트
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === file.id ? { ...f, uploadedUrl, isUploaded: true } : f,
        ),
      );

      toast.success(`${file.name} 업로드 완료!`);
    } catch (error) {
      console.error(`파일 업로드 실패: ${file.name}`, error);
      toast.error(
        `${file.name} 업로드 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
      );

      // 실패한 파일 제거
      setUploadedFiles((prev) => prev.filter((f) => f.id !== file.id));
    }
  }

  // 파일 업로드 완료
  setIsFileUploading(false);
  console.log("모든 파일 업로드 처리 완료");
}

// Threads 업로드 핸들러
export async function handleThreadsUpload(
  result: any,
  displayContent: string,
  uploadedFiles: UploadedFile[],
  setIsUploading: (uploading: boolean) => void,
  navigate: (path: string) => void,
): Promise<void> {
  setIsUploading(true);

  // 파일 개수에 따른 분기 처리
  const uploadedFilesCount = uploadedFiles.filter((f) => f.isUploaded).length;
  const hasMultipleFiles = uploadedFilesCount > 1;

  console.log(`=== 파일 업로드 정보 ===`);

  // 업로드된 파일들의 URL 로깅
  const uploadedFilesWithUrls = uploadedFiles.filter(
    (f) => f.isUploaded && f.uploadedUrl,
  );
  uploadedFilesWithUrls.forEach((file, index) => {});

  const formData = new FormData();
  formData.append("shortText", result.originalText);
  formData.append("text", displayContent); // 편집된 내용 사용
  formData.append("keywords", result.keywords.join(","));
  formData.append("moods", result.moods.join(","));
  formData.append("intents", result.intents?.join(",") || "");

  // 미디어 파일 정보 추가 (이미지 파일만)
  const mediaFilesWithUrls = uploadedFiles.filter(
    (f) => f.isUploaded && f.uploadedUrl,
  );

  if (mediaFilesWithUrls.length > 0) {
    const mediaFilesData = mediaFilesWithUrls.map((file) => ({
      original_filename: file.name,
      public_url: file.uploadedUrl!,
      file_size: file.size,
      mime_type: file.file.type,
      storage_path: extractFilePathFromUrl(file.uploadedUrl!),
      media_type: file.type,
    }));
    formData.append("mediaFiles", JSON.stringify(mediaFilesData));
  }

  // 단일 파일 처리 (이미지)
  if (uploadedFilesWithUrls.length === 1) {
    const uploadedFile = uploadedFilesWithUrls[0];
    if (uploadedFile && uploadedFile.uploadedUrl) {
      formData.append("imageUrl", uploadedFile.uploadedUrl);
    }
  } else if (uploadedFilesWithUrls.length > 1) {
    // 다중 파일 처리 (이미지)
    const imageUrls: string[] = [];
    mediaFilesWithUrls.forEach((file) => {
      imageUrls.push(file.uploadedUrl!);
    });
    if (imageUrls.length > 0) {
      formData.append("imageUrls", imageUrls.join(","));
      console.log(`이미지 URLs: ${imageUrls.join(", ")}`);
    }
  }

  try {
    // API 호출
    const response = await fetch("/api/write/send-to-thread", {
      method: "POST",
      body: formData,
    });

    const responseData = await response.json();

    if (response.ok && responseData.success) {
      // 성공 시 바로 목록으로 이동
      toast.success(
        "홍보글이 저장되었습니다. Threads 업로드가 진행 중입니다.",
        {
          autoClose: 3000,
        },
      );
      navigate(`/dashboard/history?upload=success&platform=threads`);
    } else {
      // 실패 시 에러 메시지 표시
      toast.error(responseData.message || "업로드에 실패했습니다.", {
        autoClose: 5000,
      });
      setIsUploading(false);
    }
  } catch (error) {
    console.error("API 호출 중 오류:", error);
    toast.error("업로드 중 오류가 발생했습니다.", {
      autoClose: 5000,
    });
    setIsUploading(false);
  }
}
