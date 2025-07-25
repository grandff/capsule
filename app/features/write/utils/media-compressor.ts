import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import sharp from "sharp";

/**
 * Media Compression Utilities
 *
 * sharp를 사용하여 이미지 파일의 크기를 줄여서 업로드하기 위한 유틸리티 함수들
 * FFmpeg.wasm을 사용하여 동영상 파일의 크기를 줄여서 업로드하기 위한 유틸리티 함수들
 */

// 이미지 압축 옵션
interface ImageCompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: "jpeg" | "png" | "webp";
}

// 동영상 압축 옵션
interface VideoCompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  bitrate?: string;
  fps?: number;
  format?: "mp4" | "webm";
}

/**
 * 파일이 이미지인지 확인합니다
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

/**
 * 파일이 동영상인지 확인합니다
 */
export function isVideoFile(file: File): boolean {
  return file.type.startsWith("video/");
}

/**
 * 이미지 파일을 압축합니다 (서버사이드용)
 * @param buffer - 압축할 이미지 버퍼
 * @param options - 압축 옵션
 * @returns 압축된 이미지 버퍼
 */
export async function compressImage(
  buffer: Buffer,
  options: ImageCompressionOptions = {},
): Promise<Buffer> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 70,
    format = "jpeg",
  } = options;

  try {
    let sharpInstance = sharp(buffer);

    // 이미지 방향 자동 회전 (EXIF 정보 기반)
    sharpInstance = sharpInstance.rotate();

    // 이미지 메타데이터 가져오기
    const metadata = await sharpInstance.metadata();
    const { width: originalWidth, height: originalHeight } = metadata;

    if (!originalWidth || !originalHeight) {
      throw new Error("이미지 크기를 확인할 수 없습니다.");
    }

    // 새로운 크기 계산 (비율 유지)
    const { width: newWidth, height: newHeight } = calculateNewDimensions(
      originalWidth,
      originalHeight,
      maxWidth,
      maxHeight,
    );

    // 리사이즈 및 압축 (비율 유지하면서 최대 크기 내에서 맞춤)
    sharpInstance = sharpInstance.resize(newWidth, newHeight, {
      fit: "inside",
      withoutEnlargement: true,
    });

    // 포맷에 따른 압축 설정
    switch (format) {
      case "jpeg":
        sharpInstance = sharpInstance.jpeg({ quality });
        break;
      case "png":
        sharpInstance = sharpInstance.png({ quality });
        break;
      case "webp":
        sharpInstance = sharpInstance.webp({ quality });
        break;
      default:
        sharpInstance = sharpInstance.jpeg({ quality });
    }

    // 압축된 이미지 버퍼 반환
    const compressedBuffer = await sharpInstance.toBuffer();

    console.log(
      `이미지 압축 완료: ${originalWidth}x${originalHeight} → ${newWidth}x${newHeight}, ${formatBufferSize(buffer)} → ${formatBufferSize(compressedBuffer)}`,
    );

    return compressedBuffer;
  } catch (error) {
    console.error("이미지 압축 오류:", error);
    throw new Error("이미지 압축에 실패했습니다.");
  }
}

/**
 * 이미지 파일을 압축합니다 (File → Buffer 변환 포함)
 * @param file - 압축할 이미지 파일
 * @param options - 압축 옵션
 * @returns 압축된 이미지 버퍼
 */
export async function compressImageFile(
  file: File,
  options: ImageCompressionOptions = {},
): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return compressImage(buffer, options);
}

/**
 * 동영상 파일을 압축합니다 (클라이언트사이드용)
 * @param file - 압축할 동영상 파일
 * @param options - 압축 옵션
 * @returns 압축된 동영상 파일
 */
export async function compressVideo(
  file: File,
  options: VideoCompressionOptions = {},
): Promise<File> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    bitrate = "1000k",
    fps = 30,
    format = "mp4",
  } = options;

  try {
    console.log(
      `동영상 압축 시작: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`,
    );

    // FFmpeg 인스턴스 생성
    const ffmpeg = new FFmpeg();

    // FFmpeg 로드
    await ffmpeg.load({
      coreURL: await toBlobURL(`/ffmpeg/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`/ffmpeg/ffmpeg-core.wasm`, "application/wasm"),
    });

    // 입력 파일을 FFmpeg에 로드
    const inputFileName = "input" + getFileExtension(file.name);
    const outputFileName = "output." + format;

    ffmpeg.writeFile(inputFileName, await fetchFile(file));

    // 압축 명령어 실행
    await ffmpeg.exec([
      "-i",
      inputFileName,
      "-c:v",
      "libx264",
      "-preset",
      "medium",
      "-crf",
      "23",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      "-vf",
      `scale=${maxWidth}:${maxHeight}:force_original_aspect_ratio=decrease`,
      "-r",
      fps.toString(),
      "-movflags",
      "+faststart",
      outputFileName,
    ]);

    // 압축된 파일 읽기
    const compressedData = await ffmpeg.readFile(outputFileName);

    // Blob으로 변환
    const compressedBlob = new Blob([compressedData], {
      type: `video/${format}`,
    });

    // File 객체로 변환
    const compressedFile = new File(
      [compressedBlob],
      file.name.replace(/\.[^/.]+$/, `.${format}`),
      {
        type: `video/${format}`,
        lastModified: Date.now(),
      },
    );

    console.log(
      `동영상 압축 완료: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB)`,
    );

    return compressedFile;
  } catch (error) {
    console.error("동영상 압축 오류:", error);
    throw new Error("동영상 압축에 실패했습니다.");
  }
}

/**
 * 파일 확장자를 추출합니다
 */
function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
}

/**
 * 파일이 압축이 필요한지 확인합니다
 */
export function needsCompression(file: File): boolean {
  const maxImageSize = 6 * 1024 * 1024; // 6MB
  const maxVideoSize = 500 * 1024 * 1024; // 500MB

  if (isImageFile(file)) {
    return file.size > maxImageSize;
  } else if (isVideoFile(file)) {
    return file.size > maxVideoSize;
  }

  return false;
}

/**
 * 미디어 파일을 압축합니다 (서버사이드용)
 * @param file - 압축할 파일
 * @returns 압축된 버퍼 (이미지) 또는 원본 버퍼 (동영상)
 */
export async function compressMedia(file: File): Promise<Buffer> {
  if (isImageFile(file)) {
    return await compressImageFile(file);
  } else if (isVideoFile(file)) {
    // 동영상은 서버사이드에서 압축하지 않고 원본 반환
    // 클라이언트사이드에서 압축 후 업로드하는 것을 권장
    const arrayBuffer = await file.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } else {
    throw new Error("지원하지 않는 파일 형식입니다.");
  }
}

/**
 * 새로운 크기를 계산합니다 (비율 유지)
 */
function calculateNewDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number,
): { width: number; height: number } {
  const aspectRatio = originalWidth / originalHeight;

  let newWidth = originalWidth;
  let newHeight = originalHeight;

  if (originalWidth > maxWidth) {
    newWidth = maxWidth;
    newHeight = Math.round(maxWidth / aspectRatio);
  }

  if (newHeight > maxHeight) {
    newHeight = maxHeight;
    newWidth = Math.round(maxHeight * aspectRatio);
  }

  return { width: newWidth, height: newHeight };
}

/**
 * 버퍼 크기를 포맷된 문자열로 변환합니다
 */
function formatBufferSize(buffer: Buffer): string {
  const sizeInMB = buffer.length / 1024 / 1024;
  return `${sizeInMB.toFixed(2)}MB`;
}

/**
 * 파일 크기를 포맷된 문자열로 변환합니다
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
