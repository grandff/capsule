import { Eye, EyeOff, Monitor, Moon, Sun, Type, UserX } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Form, useFetcher, useNavigate } from "react-router";
import { Theme, useTheme } from "remix-themes";

import { Alert, AlertDescription } from "~/core/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/core/components/ui/alert-dialog";
import { Badge } from "~/core/components/ui/badge";
import { Button } from "~/core/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";
import { Separator } from "~/core/components/ui/separator";
import { useSettings } from "~/core/contexts/settings-context";

type FontSize = "default" | "large" | "larger";

export default function Setting() {
  const { t } = useTranslation();
  const [theme, setTheme] = useTheme();
  const fetcher = useFetcher();
  const navigate = useNavigate();

  // Context에서 설정 가져오기
  const {
    fontSize,
    colorBlindMode,
    isLoading,
    updateFontSize,
    updateColorBlindMode,
  } = useSettings();

  // 오류 상태 관리
  const [themeError, setThemeError] = useState<string | null>(null);
  const [fontSizeError, setFontSizeError] = useState<string | null>(null);
  const [colorBlindError, setColorBlindError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // 테마 변경 핸들러
  const handleThemeChange = async (newTheme: "light" | "dark" | "system") => {
    setThemeError(null);
    try {
      // 1. remix-themes로 세션 업데이트
      const formData = new FormData();
      formData.append("theme", newTheme);

      await fetch("/api/settings/theme", {
        method: "POST",
        body: formData,
      });

      // 2. remix-themes 상태 업데이트
      if (newTheme === "system") {
        setTheme(null); // 시스템 설정은 null로 설정
      } else if (newTheme === "light") {
        setTheme(Theme.LIGHT);
      } else {
        setTheme(Theme.DARK);
      }

      // 3. 데이터베이스에 저장 (Context에서 처리)
      await updateFontSize(fontSize);
    } catch (error) {
      console.error("테마 변경 중 오류:", error);
      setThemeError("테마 변경에 실패했습니다.");
    }
  };

  // 글꼴 크기 설정 핸들러
  const handleFontSizeChange = async (newFontSize: FontSize) => {
    setFontSizeError(null);
    try {
      await updateFontSize(newFontSize);
    } catch (error) {
      console.error("글꼴 크기 변경 중 오류:", error);
      setFontSizeError("글꼴 크기 변경에 실패했습니다.");
    }
  };

  // 색약 모드 설정 핸들러
  const handleColorBlindModeChange = async (enabled: boolean) => {
    setColorBlindError(null);
    try {
      await updateColorBlindMode(enabled);
    } catch (error) {
      console.error("색약 모드 변경 중 오류:", error);
      setColorBlindError("색약 모드 변경에 실패했습니다.");
    }
  };

  // 회원탈퇴 처리
  const handleDeleteAccount = () => {
    setShowDeleteDialog(false);
    fetcher.submit({}, { method: "POST", action: "/api/users" });
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-8 p-6">
      <div className="text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          개인화 설정
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          나만의 맞춤형 경험을 위한 설정을 관리하세요
        </p>
        {isLoading && (
          <div className="mt-4 rounded-lg bg-blue-50 p-2 dark:bg-blue-900/20">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              설정을 저장하는 중...
            </p>
          </div>
        )}
      </div>

      {/* 테마 설정 */}
      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Monitor className="h-5 w-5" />
            테마 설정
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            앱의 색상 테마를 선택하세요
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {themeError && (
            <Alert variant="destructive">
              <AlertDescription>{themeError}</AlertDescription>
            </Alert>
          )}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Button
              variant={theme === Theme.LIGHT ? "default" : "outline"}
              onClick={() => handleThemeChange("light")}
              disabled={isLoading}
              className="flex h-auto w-full flex-col items-center gap-2 p-4"
            >
              <Sun className="h-6 w-6" />
              <span className="font-medium">라이트 모드</span>
              <span className="text-xs text-gray-500">밝은 테마</span>
            </Button>

            <Button
              variant={theme === Theme.DARK ? "default" : "outline"}
              onClick={() => handleThemeChange("dark")}
              disabled={isLoading}
              className="flex h-auto w-full flex-col items-center gap-2 p-4"
            >
              <Moon className="h-6 w-6" />
              <span className="font-medium">다크 모드</span>
              <span className="text-xs text-gray-500">어두운 테마</span>
            </Button>

            <Button
              variant={theme === null ? "default" : "outline"}
              onClick={() => handleThemeChange("system")}
              disabled={isLoading}
              className="flex h-auto w-full flex-col items-center gap-2 p-4"
            >
              <Monitor className="h-6 w-6" />
              <span className="font-medium">시스템 설정</span>
              <span className="text-xs text-gray-500">자동 감지</span>
            </Button>
          </div>

          {theme === null && (
            <div className="mt-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                시스템 설정에 따라 자동으로 테마가 변경됩니다.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 글꼴 크기 설정 */}
      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Type className="h-5 w-5" />
            글꼴 크기
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            텍스트의 크기를 조정하세요
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {fontSizeError && (
            <Alert variant="destructive">
              <AlertDescription>{fontSizeError}</AlertDescription>
            </Alert>
          )}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Button
              variant={fontSize === "default" ? "default" : "outline"}
              onClick={() => handleFontSizeChange("default")}
              disabled={isLoading}
              className="flex h-auto flex-col items-center gap-2 p-4"
            >
              <span className="text-base font-medium">기본</span>
              <span className="text-xs text-gray-500">16px</span>
            </Button>

            <Button
              variant={fontSize === "large" ? "default" : "outline"}
              onClick={() => handleFontSizeChange("large")}
              disabled={isLoading}
              className="flex h-auto flex-col items-center gap-2 p-4"
            >
              <span className="text-lg font-medium">크게</span>
              <span className="text-xs text-gray-500">18px</span>
            </Button>

            <Button
              variant={fontSize === "larger" ? "default" : "outline"}
              onClick={() => handleFontSizeChange("larger")}
              disabled={isLoading}
              className="flex h-auto flex-col items-center gap-2 p-4"
            >
              <span className="text-xl font-medium">더 크게</span>
              <span className="text-xs text-gray-500">20px</span>
            </Button>
          </div>

          <div className="mt-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              미리보기: 이 텍스트는 현재 설정된 글꼴 크기로 표시됩니다.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 색약 모드 설정 */}
      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            {colorBlindMode ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
            색약 모드
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            색상 구분이 어려운 경우 흑백 모드로 전환하세요
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {colorBlindError && (
            <Alert variant="destructive">
              <AlertDescription>{colorBlindError}</AlertDescription>
            </Alert>
          )}
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-red-500"></div>
                <div className="h-4 w-4 rounded bg-green-500"></div>
                <div className="h-4 w-4 rounded bg-blue-500"></div>
              </div>
              <span className="text-sm font-medium">색상 구분</span>
            </div>

            <Button
              variant={colorBlindMode ? "default" : "outline"}
              onClick={() => handleColorBlindModeChange(!colorBlindMode)}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {colorBlindMode ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  활성화됨
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  비활성화됨
                </>
              )}
            </Button>
          </div>

          {colorBlindMode && (
            <div className="rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                색약 모드가 활성화되었습니다. 모든 색상이 흑백으로 표시됩니다.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 현재 설정 요약 */}
      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">
            현재 설정 요약
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-sm">
              테마:{" "}
              {theme === Theme.LIGHT
                ? "라이트"
                : theme === Theme.DARK
                  ? "다크"
                  : "시스템"}
            </Badge>
            <Badge variant="secondary" className="text-sm">
              글꼴:{" "}
              {fontSize === "default"
                ? "기본"
                : fontSize === "large"
                  ? "크게"
                  : "더 크게"}
            </Badge>
            <Badge
              variant={colorBlindMode ? "default" : "secondary"}
              className="text-sm"
            >
              색약 모드: {colorBlindMode ? "활성화" : "비활성화"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* 회원탈퇴 영역 */}
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <UserX className="h-5 w-5" />
            회원탈퇴
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            계정을 영구적으로 삭제합니다. 이 작업은 되돌릴 수 없습니다.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
              <h4 className="mb-2 font-medium text-red-800 dark:text-red-200">
                탈퇴 시 삭제되는 데이터:
              </h4>
              <ul className="space-y-1 text-sm text-red-700 dark:text-red-300">
                <li>• 개인 프로필 정보</li>
                <li>• 작성한 모든 게시글</li>
                <li>• 업로드한 미디어 파일</li>
                <li>• 연결된 SNS 계정 정보</li>
                <li>• 사용 통계 및 분석 데이터</li>
              </ul>
            </div>

            <AlertDialog
              open={showDeleteDialog}
              onOpenChange={setShowDeleteDialog}
            >
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="lg"
                  className="w-full"
                  disabled={fetcher.state !== "idle"}
                >
                  {fetcher.state !== "idle" ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      탈퇴 처리 중...
                    </>
                  ) : (
                    <>
                      <UserX className="mr-2 h-4 w-4" />
                      회원탈퇴
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-red-600">
                    정말 탈퇴하시겠습니까?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    회원탈퇴를 진행하면 다음 데이터가{" "}
                    <strong>영구적으로 삭제</strong>됩니다:
                    <br />
                    <br />
                    • 개인 프로필 정보
                    <br />
                    • 작성한 모든 게시글
                    <br />
                    • 업로드한 미디어 파일
                    <br />
                    • 연결된 SNS 계정 정보
                    <br />
                    • 사용 통계 및 분석 데이터
                    <br />
                    <br />이 작업은 되돌릴 수 없습니다. 정말 탈퇴하시겠습니까?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    탈퇴하기
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
