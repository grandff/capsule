import type { UploadedFile } from "../utils/file-upload-utils";
import type { Route } from "./+types/write-result";

import { useEffect, useRef, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { ToastContainer } from "react-toastify";
import { z } from "zod";

import { Alert, AlertDescription } from "~/core/components/ui/alert";

import { ActionButtons } from "../components/action-buttons";
import { GeneratedContentCard } from "../components/generated-content-card";
import { MediaUploadSection } from "../components/media-upload-section";
import { DeleteConfirmAlert } from "../components/notifications";
import { SuccessAlert } from "../components/notifications";
import { OriginalTextCard } from "../components/original-text-card";
import { SelectedOptionsCard } from "../components/selected-options-card";
import {
  deleteFileFromStorage,
  extractFilePathFromUrl,
} from "../utils/file-upload-utils";
import {
  handleCopy,
  handleFileUpload,
  handleThreadsUpload,
} from "../utils/upload-utils";

export const meta: Route.MetaFunction = () => {
  return [{ title: `Result | ${import.meta.env.VITE_APP_NAME}` }];
};

const promotionResultSchema = z.object({
  content: z.string(),
  originalText: z.string(),
  moods: z.array(z.string()),
  keywords: z.array(z.string()),
  intents: z.array(z.string()).optional(),
  length: z.string().optional(),
  timeframe: z.string().optional(),
  weather: z.string().optional(),
});

// FIXME 오류 나는 경우에는 오류 페이지로 이동시키기
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const resultParam = url.searchParams.get("result");
  if (!resultParam) {
    return new Response(JSON.stringify({ error: "결과 데이터가 없습니다." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  try {
    const parsed = JSON.parse(resultParam);
    const result = promotionResultSchema.parse(parsed);
    return new Response(JSON.stringify({ result }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "결과 데이터 파싱 또는 검증 실패" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }
}

interface LoaderData {
  result?: z.infer<typeof promotionResultSchema>;
  error?: string;
}

export default function WriteResult() {
  const loaderData = useLoaderData() as LoaderData;
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadError, setUploadError] = useState<string>("");
  const [editedContent, setEditedContent] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [result, setResult] = useState<z.infer<
    typeof promotionResultSchema
  > | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // result 상태 초기화
  useEffect(() => {
    if (loaderData.result) {
      setResult(loaderData.result);
    }
  }, [loaderData.result]);

  if (loaderData?.error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Alert className="border-red-200 bg-red-50 text-red-800">
          <AlertDescription>{loaderData.error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Alert className="border-red-200 bg-red-50 text-red-800">
          <AlertDescription>결과 데이터가 없습니다.</AlertDescription>
        </Alert>
      </div>
    );
  }

  // 파일 업로드 핸들러
  const handleFileUploadChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files) return;

    await handleFileUpload(
      files,
      uploadedFiles,
      setUploadedFiles,
      setUploadError,
      setIsFileUploading,
    );

    // 파일 입력 초기화
    if (event.target) {
      event.target.value = "";
    }
  };

  // 파일 삭제 확인 핸들러
  const handleFileRemoveConfirm = (fileId: string) => {
    setFileToDelete(fileId);
    setShowDeleteAlert(true);
  };

  // 파일 삭제 실행 핸들러
  const handleFileRemove = async () => {
    if (!fileToDelete) return;

    const fileToRemove = uploadedFiles.find((f) => f.id === fileToDelete);
    if (!fileToRemove) return;

    try {
      // API를 통해 Supabase Storage에서 파일 삭제
      if (fileToRemove.uploadedUrl) {
        const filePath = extractFilePathFromUrl(fileToRemove.uploadedUrl);
        await deleteFileFromStorage(filePath);
      }

      // 로컬 상태에서 파일 제거
      setUploadedFiles((prev) => {
        const fileToRemove = prev.find((f) => f.id === fileToDelete);
        if (fileToRemove) {
          URL.revokeObjectURL(fileToRemove.preview);
        }
        return prev.filter((f) => f.id !== fileToDelete);
      });
    } catch (error) {
      console.error("파일 삭제 중 오류:", error);
    } finally {
      setShowDeleteAlert(false);
      setFileToDelete(null);
    }
  };

  // 다시 작성하기 핸들러
  const handleRewrite = () => {
    navigate("/dashboard/write/today");
  };

  // 편집 모드 토글 핸들러
  const handleToggleEdit = () => {
    if (!isEditing) {
      setEditedContent(result?.content || "");
    }
    setIsEditing(!isEditing);
  };

  // 편집 완료 핸들러
  const handleSaveEdit = () => {
    // result 객체를 직접 수정할 수 없으므로, 새로운 상태로 관리
    setResult((prev: z.infer<typeof promotionResultSchema> | null) =>
      prev ? { ...prev, content: editedContent } : prev,
    );
    setIsEditing(false);
  };

  // 편집 취소 핸들러
  const handleCancelEdit = () => {
    setEditedContent(result?.content || "");
    setIsEditing(false);
  };

  // 복사 핸들러
  const handleCopyClick = async () => {
    const success = await handleCopy(displayContent);
    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    }
  };

  // 현재 표시할 콘텐츠 (편집 중이면 editedContent, 아니면 원본)
  const displayContent = isEditing ? editedContent : result.content;

  // 업로드하기 핸들러
  const handleUpload = async (platform: string) => {
    if (!result) return;

    if (platform === "threads") {
      // 먼저 DB에 저장하고 목록으로 이동
      await handleThreadsUpload(
        result,
        displayContent,
        uploadedFiles,
        setIsUploading,
        navigate,
      );
      return;
    }

    // 다른 플랫폼은 기존과 동일하게 처리
    setTimeout(() => {
      setIsUploading(false);
      navigate(`/dashboard/history?upload=success&platform=${platform}`);
    }, 3000);
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Toast 알림 */}
      <ToastContainer />

      {/* 성공 알림 */}
      <SuccessAlert show={showSuccessAlert} />

      {/* 삭제 확인 Alert */}
      <DeleteConfirmAlert
        show={showDeleteAlert}
        onConfirm={handleFileRemove}
        onCancel={() => setShowDeleteAlert(false)}
      />

      {/* 메인 컨텐츠 영역 */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-4xl space-y-6">
          {/* 결과 제목 */}
          <div className="text-center">
            <h1 className="text-3xl font-bold">오늘의 이야기 생성 완료!</h1>
            <p className="text-muted-foreground mt-2">
              입력하신 내용을 바탕으로 오늘의 이야기를 생성했어요.
            </p>
          </div>

          {/* 원본 텍스트 */}
          <OriginalTextCard originalText={result.originalText} />

          {/* 선택된 옵션들 */}
          <SelectedOptionsCard
            moods={result.moods}
            keywords={result.keywords}
            intents={result.intents}
            length={result.length}
            timeframe={result.timeframe}
            weather={result.weather}
          />

          {/* 생성된 홍보글 */}
          <GeneratedContentCard
            content={result.content}
            isEditing={isEditing}
            editedContent={editedContent}
            isCopied={isCopied}
            onToggleEdit={handleToggleEdit}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={handleCancelEdit}
            onCopy={handleCopyClick}
            onEditedContentChange={setEditedContent}
          />

          {/* 파일 업로드 섹션 */}
          <MediaUploadSection
            uploadedFiles={uploadedFiles}
            uploadError={uploadError}
            isFileUploading={isFileUploading}
            onFileUpload={handleFileUploadChange}
            onFileRemoveConfirm={handleFileRemoveConfirm}
          />

          {/* 액션 버튼들 */}
          <ActionButtons
            isUploading={isUploading}
            isFileUploading={isFileUploading}
            onRewrite={handleRewrite}
            onUpload={handleUpload}
          />
        </div>
      </div>

      {/* Threads 업로드용 form (숨김) */}
      <form
        ref={formRef}
        method="post"
        action="/api/write/send-to-thread"
        encType="multipart/form-data"
        className="hidden"
      >
        <input type="hidden" name="text" value={result?.content || ""} />
        {/* 이미지/동영상 파일이 있다면 첫 번째 파일의 url을 전달 (실제 업로드 구현에 따라 수정) */}
        {uploadedFiles.length > 0 && uploadedFiles[0].type === "image" && (
          <input
            type="hidden"
            name="imageUrl"
            value={uploadedFiles[0].preview}
          />
        )}
        {uploadedFiles.length > 0 && uploadedFiles[0].type === "video" && (
          <input
            type="hidden"
            name="videoUrl"
            value={uploadedFiles[0].preview}
          />
        )}
      </form>
    </div>
  );
}
