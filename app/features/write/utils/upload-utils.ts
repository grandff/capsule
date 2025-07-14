import type { UploadedFile } from "./file-upload-utils";

import { toast } from "react-toastify";

import {
  extractFilePathFromUrl,
  uploadFileToStorage,
} from "./file-upload-utils";

// 복사 핸들러
export async function handleCopy(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("홍보글이 클립보드에 복사되었습니다!", {
      autoClose: 3000,
    });
    return true;
  } catch (error) {
    toast.error("복사에 실패했습니다.", {
      autoClose: 3000,
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
): Promise<void> {
  if (!files) return;

  setUploadError("");

  // 파일 개수 체크
  if (uploadedFiles.length + files.length > 20) {
    setUploadError("최대 20개까지만 업로드 가능합니다.");
    return;
  }

  // 임시로 파일들을 추가 (업로드 전)
  const newFiles: UploadedFile[] = [];

  Array.from(files).forEach((file) => {
    // 파일 타입 체크
    const isImage = ["image/jpeg", "image/png"].includes(file.type);
    const isVideo = ["video/mp4", "video/quicktime"].includes(file.type);

    if (!isImage && !isVideo) {
      setUploadError(
        "지원하지 않는 파일 형식입니다. (이미지: JPG, PNG / 동영상: MP4, MOV)",
      );
      return;
    }

    // 파일 크기 체크
    const maxSize = isImage ? 8 * 1024 * 1024 : 1024 * 1024 * 1024;
    if (file.size > maxSize) {
      const maxSizeMB = isImage ? "8MB" : "1GB";
      setUploadError(
        `${file.name} 파일이 너무 큽니다. 최대 ${maxSizeMB}까지 가능합니다.`,
      );
      return;
    }

    // 파일 추가
    const fileId = Date.now() + Math.random().toString(36).substr(2, 9);
    const fileType = isImage ? "image" : "video";

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

  // 파일들을 상태에 추가
  setUploadedFiles([...uploadedFiles, ...newFiles]);

  // 파일 업로드 시작
  setIsFileUploading(true);

  // 각 파일을 API를 통해 업로드
  for (const file of newFiles) {
    try {
      const uploadedUrl = await uploadFileToStorage(file.file);

      // 업로드 완료된 파일 업데이트
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === file.id ? { ...f, uploadedUrl, isUploaded: true } : f,
        ),
      );

      toast.success(`${file.name} 업로드 완료!`);
    } catch (error) {
      console.error(`파일 업로드 실패: ${file.name}`, error);
      toast.error(`${file.name} 업로드 실패`);

      // 실패한 파일 제거
      setUploadedFiles((prev) => prev.filter((f) => f.id !== file.id));
    }
  }

  // 파일 업로드 완료
  setIsFileUploading(false);
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
  console.log(`총 파일 개수: ${uploadedFiles.length}`);
  console.log(`업로드 완료된 파일 개수: ${uploadedFilesCount}`);
  console.log(`다중 파일 여부: ${hasMultipleFiles}`);

  // 업로드된 파일들의 URL 로깅
  const uploadedFilesWithUrls = uploadedFiles.filter(
    (f) => f.isUploaded && f.uploadedUrl,
  );
  uploadedFilesWithUrls.forEach((file, index) => {
    console.log(`파일 ${index + 1}: ${file.name} (${file.type})`);
    console.log(`Public URL: ${file.uploadedUrl}`);
  });

  const formData = new FormData();
  formData.append("shortText", result.originalText);
  formData.append("text", displayContent); // 편집된 내용 사용
  formData.append("keywords", result.keywords.join(","));
  formData.append("moods", result.moods.join(","));
  formData.append("intents", result.intents?.join(",") || "");

  // 미디어 파일 정보 추가
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

  // 파일 개수에 따른 분기 처리
  if (uploadedFilesCount === 1) {
    // 단일 파일 처리
    const uploadedFile = uploadedFiles.find((f) => f.isUploaded);
    if (uploadedFile && uploadedFile.uploadedUrl) {
      console.log(
        `단일 파일 전송: ${uploadedFile.type} - ${uploadedFile.uploadedUrl}`,
      );
      if (uploadedFile.type === "image") {
        formData.append("imageUrl", uploadedFile.uploadedUrl);
      } else if (uploadedFile.type === "video") {
        formData.append("videoUrl", uploadedFile.uploadedUrl);
      }
    }
  } else if (uploadedFilesCount > 1) {
    // 다중 파일 처리
    console.log(`다중 파일 전송 시작 (${uploadedFilesCount}개)`);
    const imageUrls: string[] = [];
    const videoUrls: string[] = [];

    mediaFilesWithUrls.forEach((file) => {
      if (file.type === "image") {
        imageUrls.push(file.uploadedUrl!);
      } else if (file.type === "video") {
        videoUrls.push(file.uploadedUrl!);
      }
    });

    // 이미지와 비디오 URL들을 쉼표로 구분하여 전송
    if (imageUrls.length > 0) {
      formData.append("imageUrls", imageUrls.join(","));
      console.log(`이미지 URLs: ${imageUrls.join(", ")}`);
    }
    if (videoUrls.length > 0) {
      formData.append("videoUrls", videoUrls.join(","));
      console.log(`비디오 URLs: ${videoUrls.join(", ")}`);
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
