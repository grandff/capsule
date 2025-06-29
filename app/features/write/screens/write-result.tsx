import {
  CheckCircle2Icon,
  FileText,
  Image,
  Loader2Icon,
  Upload,
  Video,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

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

interface PromotionResult {
  content: string;
  originalText: string;
  moods: string[];
  industries: string[];
  tones: string[];
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
}

export default function WriteResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [result, setResult] = useState<PromotionResult | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadError, setUploadError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일 제한 설정
  const MAX_FILES = 20;
  const MAX_IMAGE_SIZE = 8 * 1024 * 1024; // 8MB
  const MAX_VIDEO_SIZE = 1024 * 1024 * 1024; // 1GB
  const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png"];
  const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/quicktime"];

  useEffect(() => {
    // URL 파라미터에서 결과 데이터 파싱
    const resultParam = searchParams.get("result");
    if (resultParam) {
      try {
        const parsedResult = JSON.parse(resultParam);
        setResult(parsedResult);
      } catch (error) {
        console.error("Failed to parse result data:", error);
        // 파싱 실패 시 홈으로 리다이렉트
        navigate("/dashboard/write/today");
      }
    } else {
      // 결과 데이터가 없으면 홈으로 리다이렉트
      navigate("/dashboard/write/today");
    }
  }, [searchParams, navigate]);

  // 파일 업로드 핸들러
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setUploadError("");

    // 파일 개수 체크
    if (uploadedFiles.length + files.length > MAX_FILES) {
      setUploadError(`최대 ${MAX_FILES}개까지만 업로드 가능합니다.`);
      return;
    }

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
      };

      setUploadedFiles((prev) => [...prev, newFile]);
    });

    // 파일 입력 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 파일 삭제 핸들러
  const handleFileRemove = (fileId: string) => {
    setUploadedFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === fileId);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((f) => f.id !== fileId);
    });
    setUploadError("");
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

  // 업로드하기 핸들러
  const handleUpload = async (platform: string) => {
    if (!result) return;

    setIsUploading(true);

    // TODO: 실제 API 업로드 로직 구현 필요
    // const uploadResult = await uploadToPlatform({
    //   platform,
    //   content: result.content,
    //   originalText: result.originalText,
    //   moods: result.moods,
    //   industries: result.industries,
    //   tones: result.tones,
    //   keywords: result.keywords,
    //   intents: result.intents,
    //   length: result.length,
    //   timeframe: result.timeframe,
    //   weather: result.weather,
    //   files: uploadedFiles,
    // });

    // 3초 대기 (실제로는 API 응답 시간)
    setTimeout(() => {
      setIsUploading(false);

      // history-list로 이동하면서 성공 파라미터 전달
      navigate(`/dashboard/history?upload=success&platform=${platform}`);
    }, 3000);
  };

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2Icon className="size-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
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
                <h4 className="mb-2 font-medium">산업군</h4>
                <div className="flex flex-wrap gap-2">
                  {result.industries.map((industry) => (
                    <Badge key={industry} variant="secondary">
                      {industry}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="mb-2 font-medium">톤</h4>
                <div className="flex flex-wrap gap-2">
                  {result.tones.map((tone) => (
                    <Badge key={tone} variant="secondary">
                      {tone}
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
              <CardTitle className="text-lg">생성된 홍보글</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-4">
                <p className="leading-relaxed whitespace-pre-wrap">
                  {result.content}
                </p>
              </div>
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
                            onClick={() => handleFileRemove(file.id)}
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
                  disabled={isUploading}
                  className="bg-blue-600 px-8 py-3 text-lg hover:bg-blue-700"
                >
                  {isUploading ? (
                    <>
                      <Loader2Icon className="mr-2 size-5 animate-spin" />
                      업로드 중...
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
                  disabled={isUploading}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-gradient-to-br from-blue-500 to-purple-500" />
                    Threads
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleUpload("x")}
                  disabled={isUploading}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-black" />X (Twitter)
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
