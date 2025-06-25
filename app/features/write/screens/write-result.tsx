import { CheckCircle2Icon, Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
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

interface PromotionResult {
  content: string;
  originalText: string;
  moods: string[];
  industries: string[];
  tones: string[];
  keywords: string[];
}

export default function WriteResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [result, setResult] = useState<PromotionResult | null>(null);

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
        navigate("/write/today");
      }
    } else {
      // 결과 데이터가 없으면 홈으로 리다이렉트
      navigate("/write/today");
    }
  }, [searchParams, navigate]);

  // 다시 작성하기 핸들러
  const handleRewrite = () => {
    navigate("/write/today");
  };

  // 업로드하기 핸들러
  const handleUpload = async () => {
    if (!result) return;

    setIsUploading(true);

    // TODO: Threads API 업로드 로직 구현 필요
    // const uploadResult = await uploadToThreads({
    //   content: result.content,
    //   originalText: result.originalText,
    //   moods: result.moods,
    //   industries: result.industries,
    //   tones: result.tones,
    //   keywords: result.keywords,
    // });

    // 3초 대기 (실제로는 API 응답 시간)
    setTimeout(() => {
      setIsUploading(false);
      setShowSuccessAlert(true);

      // 2초 후 목록 화면으로 이동
      setTimeout(() => {
        navigate("/history");
      }, 2000);
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

          {/* 액션 버튼들 */}
          <div className="flex justify-center gap-4 pt-6">
            <Button
              onClick={handleRewrite}
              variant="outline"
              className="px-8 py-3 text-lg"
            >
              다시 작성하기
            </Button>
            <Button
              onClick={handleUpload}
              disabled={isUploading}
              className="bg-blue-600 px-8 py-3 text-lg hover:bg-blue-700"
            >
              {isUploading ? (
                <>
                  <Loader2Icon className="mr-2 size-5 animate-spin" />
                  업로드 중...
                </>
              ) : (
                "업로드하기"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
