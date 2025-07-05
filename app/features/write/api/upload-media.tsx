import type { ActionFunctionArgs } from "react-router";

import { data } from "react-router";
import { z } from "zod";

import makeServerClient from "~/core/lib/supa-client.server";

const uploadSchema = z.object({
  file: z.instanceof(File),
});

export async function action({ request }: ActionFunctionArgs) {
  // POST 요청만 허용
  if (request.method !== "POST") {
    return data({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const [client, headers] = makeServerClient(request);

    // 사용자 인증 확인
    const {
      data: { user },
      error: authError,
    } = await client.auth.getUser();
    if (authError || !user) {
      return data({ error: "인증이 필요합니다." }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return data({ error: "파일이 필요합니다." }, { status: 400 });
    }

    // 파일 크기 및 타입 검증
    const MAX_IMAGE_SIZE = 8 * 1024 * 1024; // 8MB
    const MAX_VIDEO_SIZE = 1024 * 1024 * 1024; // 1GB
    const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png"];
    const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/quicktime"];

    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

    if (!isImage && !isVideo) {
      return data(
        {
          error:
            "지원하지 않는 파일 형식입니다. (이미지: JPG, PNG / 동영상: MP4, MOV)",
        },
        { status: 400 },
      );
    }

    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
    if (file.size > maxSize) {
      const maxSizeMB = isImage ? "8MB" : "1GB";
      return data(
        {
          error: `파일이 너무 큽니다. 최대 ${maxSizeMB}까지 가능합니다.`,
        },
        { status: 400 },
      );
    }

    // 폴더 경로 생성 (userId/yyyy/mm/dd)
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const folderPath = `${user.id}/${year}/${month}/${day}`;

    // 파일명에 타임스탬프 추가하여 중복 방지
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop();
    const fileName = `${timestamp}.${fileExtension}`;
    const fullPath = `${folderPath}/${fileName}`;

    // Supabase Storage에 업로드
    const { data: uploadData, error: uploadError } = await client.storage
      .from("upload-medias")
      .upload(fullPath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return data(
        {
          error: `파일 업로드 실패: ${uploadError.message}`,
        },
        { status: 500 },
      );
    }

    // 공개 URL 생성
    const {
      data: { publicUrl },
    } = client.storage.from("upload-medias").getPublicUrl(fullPath);

    return data(
      {
        success: true,
        url: publicUrl,
        path: fullPath,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      },
      { headers },
    );
  } catch (error) {
    console.error("Upload API error:", error);
    return data(
      {
        error: "파일 업로드 중 오류가 발생했습니다.",
      },
      { status: 500 },
    );
  }
}
