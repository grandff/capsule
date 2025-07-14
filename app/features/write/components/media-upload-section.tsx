import type { UploadedFile } from "../utils/file-upload-utils";

import { CheckCircle2Icon, Image, Upload, Video, X } from "lucide-react";
import { useRef } from "react";
import { toast } from "react-toastify";

import { Alert, AlertDescription } from "~/core/components/ui/alert";
import { Button } from "~/core/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";

import { formatFileSize } from "../utils/file-upload-utils";

interface MediaUploadSectionProps {
  uploadedFiles: UploadedFile[];
  uploadError: string;
  isFileUploading: boolean;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFileRemoveConfirm: (fileId: string) => void;
}

export function MediaUploadSection({
  uploadedFiles,
  uploadError,
  isFileUploading,
  onFileUpload,
  onFileRemoveConfirm,
}: MediaUploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_FILES = 20;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">미디어 첨부</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 업로드 에러 메시지 */}
        {uploadError && (
          <Alert className="border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
            <AlertDescription>{uploadError}</AlertDescription>
          </Alert>
        )}

        {/* 파일 업로드 영역 */}
        <div className="space-y-4">
          {/* 업로드 버튼 */}
          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.mp4,.mov"
              onChange={onFileUpload}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="flex items-center gap-2"
              disabled={uploadedFiles.length >= MAX_FILES}
            >
              <Upload className="size-4" />
              파일 선택
            </Button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {uploadedFiles.length}/{MAX_FILES}개 파일
            </span>
          </div>

          {/* 파일 형식 안내 */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>• 이미지: JPG, PNG (최대 8MB)</p>
            <p>• 동영상: MP4, MOV (최대 1GB)</p>
            <p>• 총 최대 20개까지 업로드 가능</p>
          </div>

          {/* 업로드된 파일 목록 */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">업로드된 파일</h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="relative rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                  >
                    {/* 파일 타입 아이콘 */}
                    <div className="mb-2 flex items-center gap-2">
                      {file.type === "image" ? (
                        <Image className="size-4 text-blue-600" />
                      ) : (
                        <Video className="size-4 text-purple-600" />
                      )}
                      <span className="truncate text-sm font-medium">
                        {file.name}
                      </span>
                      {file.isUploaded && (
                        <CheckCircle2Icon className="size-4 text-green-600" />
                      )}
                    </div>

                    {/* 미리보기 */}
                    {file.type === "image" ? (
                      <div className="mb-2 aspect-video overflow-hidden rounded bg-gray-100 dark:bg-gray-800">
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="mb-2 aspect-video overflow-hidden rounded bg-gray-100 dark:bg-gray-800">
                        <video
                          src={file.preview}
                          className="h-full w-full object-cover"
                          controls
                        />
                      </div>
                    )}

                    {/* 파일 정보 */}
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)}
                    </div>

                    {/* 삭제 버튼 */}
                    <Button
                      onClick={() => onFileRemoveConfirm(file.id)}
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900 dark:hover:text-red-400"
                    >
                      <X className="size-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
