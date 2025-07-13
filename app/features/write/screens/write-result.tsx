import type { Route } from "./+types/write-result";

import {
  CheckCircle2Icon,
  Copy,
  FileText,
  Image,
  Loader2Icon,
  Upload,
  Video,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import { z } from "zod";

import { Alert, AlertDescription } from "~/core/components/ui/alert";
import { Badge } from "~/core/components/ui/badge";
import { Button } from "~/core/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/core/components/ui/dropdown-menu";
import { Textarea } from "~/core/components/ui/textarea";

interface PromotionResult {
  content: string;
  originalText: string;
  moods: string[];
  keywords: string[];
  intents: string[];
  length: string;
  timeframe: string;
  weather: string;
}

interface UploadedFile {
  id: string;
  file: File;
  type: "image" | "video";
  preview: string;
  size: number;
  name: string;
  uploadedUrl?: string; // Supabase storage URL
  isUploaded?: boolean; // 업로드 완료 여부
}

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // 파일 제한 설정
  const MAX_FILES = 20;
  const MAX_IMAGE_SIZE = 8 * 1024 * 1024; // 8MB
  const MAX_VIDEO_SIZE = 1024 * 1024 * 1024; // 1GB
  const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png"];
  const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/quicktime"];

  if (loaderData?.error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Alert className="border-red-200 bg-red-50 text-red-800">
          <AlertDescription>{loaderData.error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const result = loaderData.result;
  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Alert className="border-red-200 bg-red-50 text-red-800">
          <AlertDescription>결과 데이터가 없습니다.</AlertDescription>
        </Alert>
      </div>
    );
  }

  // 파일을 API를 통해 Supabase Storage에 업로드
  const uploadFileToStorage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/write/upload-media", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "파일 업로드 실패");
    }

    if (!result.success) {
      throw new Error(result.error || "파일 업로드 실패");
    }

    return result.url;
  };

  // 파일 업로드 핸들러
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files) return;

    setUploadError("");

    // 파일 개수 체크
    if (uploadedFiles.length + files.length > MAX_FILES) {
      setUploadError(`최대 ${MAX_FILES}개까지만 업로드 가능합니다.`);
      return;
    }

    // 임시로 파일들을 추가 (업로드 전)
    const newFiles: UploadedFile[] = [];

    Array.from(files).forEach((file) => {
      // 파일 타입 체크
      const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
      const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

      if (!isImage && !isVideo) {
        setUploadError(
          "지원하지 않는 파일 형식입니다. (이미지: JPG, PNG / 동영상: MP4, MOV)",
        );
        return;
      }

      // 파일 크기 체크
      const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
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
    setUploadedFiles((prev) => [...prev, ...newFiles]);

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

    // 파일 입력 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
        // URL에서 파일 경로 추출
        const urlParts = fileToRemove.uploadedUrl.split("/");
        const filePath = urlParts.slice(-4).join("/"); // userId/yyyy/mm/dd/filename

        const formData = new FormData();
        formData.append("filePath", filePath);

        const response = await fetch("/api/write/delete-media", {
          method: "DELETE",
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          console.error("Storage에서 파일 삭제 실패:", result.error);
        }
      }

      // 로컬 상태에서 파일 제거
      setUploadedFiles((prev) => {
        const fileToRemove = prev.find((f) => f.id === fileToDelete);
        if (fileToRemove) {
          URL.revokeObjectURL(fileToRemove.preview);
        }
        return prev.filter((f) => f.id !== fileToDelete);
      });

      toast.success("파일이 삭제되었습니다.");
    } catch (error) {
      console.error("파일 삭제 중 오류:", error);
      toast.error("파일 삭제 중 오류가 발생했습니다.");
    } finally {
      setShowDeleteAlert(false);
      setFileToDelete(null);
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

  // 다시 작성하기 핸들러
  const handleRewrite = () => {
    navigate("/dashboard/write/today");
  };

  // 편집 모드 토글 핸들러
  const handleToggleEdit = () => {
    if (!isEditing) {
      setEditedContent(result.content);
    }
    setIsEditing(!isEditing);
  };

  // 편집 완료 핸들러
  const handleSaveEdit = () => {
    setIsEditing(false);
  };

  // 편집 취소 핸들러
  const handleCancelEdit = () => {
    setEditedContent(result.content);
    setIsEditing(false);
  };

  // 복사 핸들러
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayContent);
      setIsCopied(true);
      toast.success("홍보글이 클립보드에 복사되었습니다!", {
        autoClose: 3000,
        onClose: () => setIsCopied(false),
      });
    } catch (error) {
      toast.error("복사에 실패했습니다.", {
        autoClose: 3000,
      });
    }
  };

  // 현재 표시할 콘텐츠 (편집 중이면 editedContent, 아니면 원본)
  const displayContent = isEditing ? editedContent : result.content;

  // 업로드하기 핸들러
  const handleUpload = async (platform: string) => {
    if (!result) return;
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

    if (platform === "threads") {
      const formData = new FormData();
      formData.append("shortText", result.originalText);
      formData.append("text", displayContent); // 편집된 내용 사용
      formData.append("keywords", result.keywords.join(","));
      formData.append("moods", result.moods.join(","));
      formData.append("intents", result.intents?.join(",") || "");

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

        uploadedFilesWithUrls.forEach((file) => {
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
          navigate(`/dashboard/history?upload=success&platform=${platform}`);
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
      return;
    }

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
      {showSuccessAlert && (
        <div className="fixed top-4 right-4 z-50">
          <Alert className="border-green-200 bg-green-50 text-green-800">
            <CheckCircle2Icon className="size-4 text-green-600" />
            <AlertDescription>
              홍보글이 성공적으로 업로드되었습니다!
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* 삭제 확인 Alert */}
      {showDeleteAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Alert className="w-96 border-red-200 bg-red-50 text-red-800">
            <AlertDescription className="space-y-4">
              <p>정말로 이 파일을 삭제하시겠습니까?</p>
              <div className="flex gap-2">
                <Button
                  onClick={handleFileRemove}
                  variant="destructive"
                  size="sm"
                >
                  삭제
                </Button>
                <Button
                  onClick={() => setShowDeleteAlert(false)}
                  variant="outline"
                  size="sm"
                >
                  취소
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* 메인 컨텐츠 영역 */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-4xl space-y-6">
          {/* 결과 제목 */}
          <div className="text-center">
            <h1 className="text-3xl font-bold">홍보글 생성 완료!</h1>
            <p className="text-muted-foreground mt-2">
              입력하신 내용을 바탕으로 홍보글을 생성했습니다.
            </p>
          </div>

          {/* 원본 텍스트 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">원본 텍스트</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{result.originalText}</p>
            </CardContent>
          </Card>

          {/* 선택된 옵션들 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">선택된 옵션</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="mb-2 font-medium">분위기</h4>
                <div className="flex flex-wrap gap-2">
                  {result.moods.map((mood) => (
                    <Badge key={mood} variant="secondary">
                      {mood}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-2 font-medium">키워드</h4>
                <div className="flex flex-wrap gap-2">
                  {result.keywords.map((keyword) => (
                    <Badge key={keyword} variant="outline">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* 추가된 옵션들 */}
              {result.intents && result.intents.length > 0 && (
                <div>
                  <h4 className="mb-2 font-medium">의도</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.intents.map((intent) => (
                      <Badge key={intent} variant="secondary">
                        {intent}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {result.length && (
                <div>
                  <h4 className="mb-2 font-medium">글 길이</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{result.length}</Badge>
                  </div>
                </div>
              )}

              {result.timeframe && (
                <div>
                  <h4 className="mb-2 font-medium">시점/상황</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{result.timeframe}</Badge>
                  </div>
                </div>
              )}

              {result.weather && (
                <div>
                  <h4 className="mb-2 font-medium">날씨</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{result.weather}</Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 생성된 홍보글 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">생성된 홍보글</CardTitle>
                <div className="flex items-center gap-2">
                  {!isEditing && (
                    <>
                      <Button
                        onClick={handleToggleEdit}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <FileText className="size-4" />
                        수정하기
                      </Button>
                      <Button
                        onClick={handleCopy}
                        variant="outline"
                        size="sm"
                        className={`flex items-center gap-2 transition-all duration-200 ${
                          isCopied
                            ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40"
                            : ""
                        }`}
                      >
                        {isCopied ? (
                          <CheckCircle2Icon className="size-4" />
                        ) : (
                          <Copy className="size-4" />
                        )}
                        {isCopied ? "복사됨" : "복사하기"}
                      </Button>
                    </>
                  )}
                  {isEditing && (
                    <>
                      <Button
                        onClick={handleSaveEdit}
                        variant="default"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <CheckCircle2Icon className="size-4" />
                        저장
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <X className="size-4" />
                        취소
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="min-h-[200px] resize-none text-base leading-relaxed"
                  placeholder="홍보글을 수정해보세요..."
                />
              ) : (
                <div className="bg-muted rounded-lg p-4">
                  <p className="leading-relaxed whitespace-pre-wrap">
                    {displayContent}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 파일 업로드 섹션 */}
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
                    onChange={handleFileUpload}
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
                            onClick={() => handleFileRemoveConfirm(file.id)}
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

          {/* 액션 버튼들 */}
          <div className="flex justify-center gap-4 pt-6">
            <Button
              onClick={handleRewrite}
              variant="outline"
              className="px-8 py-3 text-lg"
            >
              다시 작성하기
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  disabled={isUploading || isFileUploading}
                  className="bg-blue-600 px-8 py-3 text-lg hover:bg-blue-700"
                >
                  {isUploading ? (
                    <>
                      <Loader2Icon className="mr-2 size-5 animate-spin" />
                      업로드 중...
                    </>
                  ) : isFileUploading ? (
                    <>
                      <Loader2Icon className="mr-2 size-5 animate-spin" />
                      파일 업로드 중...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 size-5" />
                      업로드하기
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => handleUpload("threads")}
                  disabled={isUploading || isFileUploading}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-gradient-to-br from-blue-500 to-purple-500" />
                    Threads
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleUpload("x")}
                  disabled={isUploading || isFileUploading}
                  className="cursor-pointer opacity-50"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-black" />X (Twitter)
                    <Badge variant="outline" className="ml-auto text-xs">
                      Coming Soon
                    </Badge>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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

function sendToThread(
  result: PromotionResult,
): { data: any; error: any } | PromiseLike<{ data: any; error: any }> {
  throw new Error("Function not implemented.");
}
