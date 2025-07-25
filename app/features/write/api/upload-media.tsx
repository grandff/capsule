import type { ActionFunctionArgs } from "react-router";

import { data } from "react-router";

import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  MAX_IMAGE_SIZE,
  MAX_IMAGE_SIZE_MB,
  MAX_VIDEO_SIZE,
  MAX_VIDEO_SIZE_MB,
} from "~/constants";
import makeServerClient from "~/core/lib/supa-client.server";

import {
  compressMedia,
  isImageFile,
  isVideoFile,
  needsCompression,
} from "../utils/media-compressor";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return data({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const [client] = makeServerClient(request);
    const {
      data: { user },
      error: authError,
    } = await client.auth.getUser();

    if (authError || !user) {
      return data({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    let file = formData.get("file") as File;

    if (!file) {
      return data({ error: "파일이 없습니다." }, { status: 400 });
    }

    // 파일 타입 확인
    const isImage = isImageFile(file);
    const isVideo = isVideoFile(file);

    if (!isImage && !isVideo) {
      return data({ error: "지원하지 않는 파일 형식입니다." }, { status: 400 });
    }

    // 압축이 필요한지 확인하고 압축 수행 (이미지만 서버사이드에서 압축)
    let compressedBuffer: Buffer | null = null;
    let isCompressed = false;

    if (isImage && needsCompression(file)) {
      try {
        console.log(
          `이미지 압축 시작: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`,
        );
        compressedBuffer = await compressMedia(file);
        isCompressed = true;
        console.log(
          `이미지 압축 완료: ${file.name} (${(compressedBuffer.length / 1024 / 1024).toFixed(2)}MB)`,
        );
      } catch (compressionError) {
        console.warn("이미지 압축 실패, 원본 파일 사용:", compressionError);
        // 압축 실패 시 원본 파일 사용
      }
    }

    // 압축된 파일이 있으면 압축된 크기로 검증, 없으면 원본 크기로 검증
    const fileSize = compressedBuffer ? compressedBuffer.length : file.size;
    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;

    if (fileSize > maxSize) {
      const maxSizeMB = isImage ? MAX_IMAGE_SIZE_MB : MAX_VIDEO_SIZE_MB;
      return data(
        {
          error: `파일이 너무 큽니다. 최대 ${maxSizeMB}까지 가능합니다.`,
        },
        { status: 400 },
      );
    }

    // 올바른 버킷 구조: {user.id}/{year}/{month}/{day}/{fileName}
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const fullPath = `${user.id}/${year}/${month}/${day}/${fileName}`;

    console.log(`파일 업로드 경로: ${fullPath}`);

    // Supabase Storage에 업로드 (압축된 파일이 있으면 압축된 파일 사용)
    let uploadData: File | Buffer;

    if (compressedBuffer) {
      // 압축된 Buffer를 File 객체로 변환
      const compressedFile = new File([compressedBuffer], file.name, {
        type: file.type,
        lastModified: Date.now(),
      });
      uploadData = compressedFile;
    } else {
      uploadData = file;
    }

    const { data: uploadResult, error: uploadError } = await client.storage
      .from("upload-medias")
      .upload(fullPath, uploadData, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return data({ error: "파일 업로드에 실패했습니다." }, { status: 500 });
    }

    // 공개 URL 생성
    const { data: urlData } = client.storage
      .from("upload-medias")
      .getPublicUrl(fullPath);

    return data({
      success: true,
      url: urlData.publicUrl,
      path: fullPath,
      fileName: fileName,
      fileType: isImage ? "image" : "video",
      compressed: isCompressed,
      originalSize: file.size,
      compressedSize: compressedBuffer ? compressedBuffer.length : file.size,
    });
  } catch (error) {
    console.error("Upload media error:", error);
    return data({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
