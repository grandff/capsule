import { ImageIcon, UploadIcon, XIcon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { ALLOWED_IMAGE_TYPES, MAX_FILES, MAX_FILE_SIZE } from "~/constants";
import { Badge } from "~/core/components/ui/badge";
import { Button } from "~/core/components/ui/button";

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  type: "image";
  size: number;
}

interface FileUploadProps {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // MB 단위
}

export default function FileUpload({
  files,
  onFilesChange,
  maxFiles = MAX_FILES,
  maxFileSize = MAX_FILE_SIZE,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string>("");
  const [compressing, setCompressing] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일 유효성 검사
  const validateFile = (file: File): string | null => {
    if (file.size > maxFileSize * 1024 * 1024) {
      return `파일 크기는 ${maxFileSize}MB 이하여야 합니다.`;
    }
    // 이미지 파일만 허용
    const isValidImage = file.type.startsWith("image/");
    if (!isValidImage) {
      return "이미지 파일만 업로드 가능합니다.";
    }
    return null;
  };

  // 동영상 압축 처리
  const processVideoCompression = async (file: File): Promise<File> => {
    // 비디오 압축 로직 제거
    return file;
  };

  // 파일 추가
  const addFiles = async (newFiles: FileList | File[]) => {
    setError("");

    if (files.length + newFiles.length > maxFiles) {
      const errorMsg = `최대 ${maxFiles}개까지 업로드 가능합니다.`;
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    const validFiles: UploadedFile[] = [];

    for (const file of Array.from(newFiles)) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        toast.error(`${file.name}: ${validationError}`);
        continue;
      }

      try {
        // 비디오 압축 등 불필요, 바로 미리보기 생성
        const preview = URL.createObjectURL(file);

        const uploadedFile: UploadedFile = {
          id: `${Date.now()}-${Math.random()}`,
          file,
          preview,
          type: "image",
          size: file.size,
        };

        validFiles.push(uploadedFile);

        // 성공 메시지
        toast.success(`${file.name} 추가 완료!`);
      } catch (error) {
        console.error("파일 처리 오류:", error);
        const errorMsg = "파일 처리 중 오류가 발생했습니다.";
        setError(errorMsg);
        toast.error(`${file.name}: ${errorMsg}`);
      }
    }

    if (validFiles.length > 0) {
      onFilesChange([...files, ...validFiles]);
    }
  };

  // 파일 제거
  const removeFile = (fileId: string) => {
    const fileToRemove = files.find((f) => f.id === fileId);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.preview);
      toast.success(`${fileToRemove.file.name} 제거 완료!`);
    }
    onFilesChange(files.filter((f) => f.id !== fileId));
    setError("");
  };

  // 드래그 앤 드롭 핸들러
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      addFiles(e.dataTransfer.files);
    }
  };

  // 파일 선택 핸들러
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      addFiles(e.target.files);
    }
  };

  // 파일 크기 포맷팅
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* 파일 업로드 영역 */}
      <div
        className={`relative rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
          dragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800/50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ALLOWED_IMAGE_TYPES.join(",")}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="space-y-2">
          <UploadIcon className="mx-auto size-8 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              파일을 드래그하거나 클릭하여 업로드
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              이미지 (JPG, PNG, WebP) 최대 {maxFileSize}MB
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="mt-2"
            disabled={compressing !== null}
          >
            {compressing ? `압축 중... (${compressing})` : "파일 선택"}
          </Button>
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="rounded-md bg-red-50 p-3 dark:bg-red-900/20">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* 압축 중 메시지 */}
      {compressing && (
        <div className="rounded-md bg-blue-50 p-3 dark:bg-blue-900/20">
          <p className="text-sm text-blue-600 dark:text-blue-400">
            동영상 압축 중: {compressing}
          </p>
        </div>
      )}

      {/* 업로드된 파일 목록 */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              업로드된 파일 ({files.length}/{maxFiles})
            </h3>
            <Badge variant="outline" className="text-xs">
              {formatFileSize(files.reduce((sum, f) => sum + f.size, 0))}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {files.map((file) => (
              <div
                key={file.id}
                className="group relative aspect-square overflow-hidden rounded-lg border bg-gray-100 dark:bg-gray-800"
              >
                <img
                  src={file.preview}
                  alt={file.file.name}
                  className="h-full w-full object-cover"
                />
                {/* 파일 정보 오버레이 */}
                <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex h-full flex-col justify-between p-2 text-white">
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        className="h-6 w-6 p-0 text-white hover:bg-white/20"
                      >
                        <XIcon className="size-4" />
                      </Button>
                    </div>
                    <div className="text-xs">
                      <p className="truncate font-medium">{file.file.name}</p>
                      <p className="text-gray-300">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                </div>
                {/* 파일 타입 아이콘 */}
                <div className="absolute bottom-1 left-1">
                  <ImageIcon className="size-4 text-white drop-shadow" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
