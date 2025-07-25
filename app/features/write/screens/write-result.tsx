import type { UploadedFile } from "../utils/file-upload-utils";
import type { Route } from "./+types/write-result";

import { useEffect, useRef, useState } from "react";
import { Form, useLoaderData, useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

import { Alert, AlertDescription } from "~/core/components/ui/alert";
import makeServerClient from "~/core/lib/supa-client.server";

import { ActionButtons } from "../components/action-buttons";
import { FeedbackResultDialog } from "../components/feedback-result-dialog";
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
import { createFeedback } from "../utils/promotion-utils";
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
    throw new Error("결과 데이터가 없습니다.");
  }

  try {
    const parsed = JSON.parse(resultParam);
    const result = promotionResultSchema.parse(parsed);

    // 사용자 ID 가져오기
    const [client] = makeServerClient(request);
    const {
      data: { user },
    } = await client.auth.getUser();

    return {
      result,
      userId: user?.id,
    };
  } catch (e) {
    throw new Error("결과 데이터 파싱 또는 검증 실패");
  }
}

export default function WriteResult({ loaderData }: Route.ComponentProps) {
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

  // 피드백 관련 상태
  const [isRequestingFeedback, setIsRequestingFeedback] = useState(false);
  const [showFeedbackResult, setShowFeedbackResult] = useState(false);
  const [feedbackResult, setFeedbackResult] = useState<{
    originalText: string;
    feedbackText: string;
  } | null>(null);
  const [hasFeedbackProcessed, setHasFeedbackProcessed] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  // result와 userId 상태 초기화

  if (!loaderData.result) {
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
    if (!files || !loaderData.userId) return;

    // 파일 업로드 시작 알림
    toast.info(`${files.length}개 파일 업로드 시작...`);

    try {
      await handleFileUpload(
        files,
        uploadedFiles,
        setUploadedFiles,
        setUploadError,
        setIsFileUploading,
        loaderData.userId,
      );

      // 파일 입력 초기화
      if (event.target) {
        event.target.value = "";
      }
    } catch (error) {
      console.error("파일 업로드 중 오류:", error);
      toast.error("파일 업로드 중 오류가 발생했습니다.");
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
      // Supabase Storage에서 파일 삭제
      if (fileToRemove.uploadedUrl) {
        const filePath = extractFilePathFromUrl(fileToRemove.uploadedUrl);
        await deleteFileFromStorage(filePath);
        toast.success(`${fileToRemove.name} 삭제 완료!`);
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
      toast.error(
        `${fileToRemove.name} 삭제 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
      );
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
      setEditedContent(loaderData.result?.content || "");
    }
    setIsEditing(!isEditing);
  };

  // 편집 완료 핸들러
  const handleSaveEdit = () => {
    // 편집된 내용을 editedContent에 저장하고 편집 모드 종료
    setIsEditing(false);
  };

  // 편집 취소 핸들러
  const handleCancelEdit = () => {
    setEditedContent(loaderData.result?.content || "");
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
  const displayContent = isEditing
    ? editedContent
    : loaderData.result?.content || "";

  // 업로드하기 핸들러
  const handleUpload = async (platform: string) => {
    if (!loaderData.result) return;

    if (platform === "threads") {
      // 먼저 DB에 저장하고 목록으로 이동
      await handleThreadsUpload(
        loaderData.result,
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

  // 피드백 요청 핸들러
  const handleFeedbackRequest = async (needs: string, etc?: string) => {
    if (!loaderData.result || hasFeedbackProcessed) return;

    setIsRequestingFeedback(true);

    try {
      const result = await createFeedback({
        text: displayContent,
        needs,
        etc: etc || "",
      });

      setFeedbackResult({
        originalText: result.originalText,
        feedbackText: result.feedbackText,
      });
      setShowFeedbackResult(true);
    } catch (error) {
      console.error("피드백 요청 중 오류:", error);
      toast.error("피드백 요청 중 오류가 발생했습니다.");
    } finally {
      setIsRequestingFeedback(false);
    }
  };

  // 피드백 결과 처리 - 그대로 유지
  const handleKeepOriginal = () => {
    setHasFeedbackProcessed(true);
    setShowFeedbackResult(false);
    toast.info("원본 글을 유지합니다.");
  };

  // 피드백 결과 처리 - 반영하기
  const handleApplyFeedback = () => {
    if (feedbackResult) {
      setEditedContent(feedbackResult.feedbackText);
      setHasFeedbackProcessed(true);
      setShowFeedbackResult(false);
      toast.success("피드백이 반영되었습니다.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* 성공 알림 */}
      <SuccessAlert show={showSuccessAlert} />

      {/* 삭제 확인 Alert */}
      <DeleteConfirmAlert
        show={showDeleteAlert}
        onConfirm={handleFileRemove}
        onCancel={() => setShowDeleteAlert(false)}
      />

      {/* 피드백 결과 다이얼로그 */}
      {feedbackResult && (
        <FeedbackResultDialog
          open={showFeedbackResult}
          onOpenChange={setShowFeedbackResult}
          originalText={feedbackResult.originalText}
          feedbackText={feedbackResult.feedbackText}
          onKeepOriginal={handleKeepOriginal}
          onApplyFeedback={handleApplyFeedback}
        />
      )}

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
          <OriginalTextCard originalText={loaderData.result.originalText} />

          {/* 선택된 옵션들 */}
          <SelectedOptionsCard
            moods={loaderData.result.moods}
            keywords={loaderData.result.keywords}
            intents={loaderData.result.intents}
            length={loaderData.result.length}
            timeframe={loaderData.result.timeframe}
            weather={loaderData.result.weather}
          />

          {/* 생성된 홍보글 */}
          <GeneratedContentCard
            content={loaderData.result.content}
            isEditing={isEditing}
            editedContent={editedContent}
            isCopied={isCopied}
            isRequestingFeedback={isRequestingFeedback}
            hasFeedbackProcessed={hasFeedbackProcessed}
            onToggleEdit={handleToggleEdit}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={handleCancelEdit}
            onCopy={handleCopyClick}
            onEditedContentChange={setEditedContent}
            onFeedbackRequest={handleFeedbackRequest}
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
      <Form
        ref={formRef}
        method="post"
        action="/api/write/send-to-thread"
        encType="multipart/form-data"
        className="hidden"
      >
        <input
          type="hidden"
          name="text"
          value={loaderData.result?.content || ""}
        />
        {/* 이미지 파일이 있다면 첫 번째 파일의 url을 전달 */}
        {uploadedFiles.length > 0 && (
          <input
            type="hidden"
            name="imageUrl"
            value={uploadedFiles[0].preview}
          />
        )}
      </Form>
    </div>
  );
}

// TODO error boundary 추가
