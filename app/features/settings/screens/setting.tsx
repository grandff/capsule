import type { Route } from "./+types/setting";

import { Eye, EyeOff, Monitor, Moon, Sun, Type, UserX } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Form,
  useFetcher,
  useNavigate,
  useRevalidator,
  useRouteLoaderData,
} from "react-router";
import { Theme, useTheme } from "remix-themes";
import { z } from "zod";

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
import { SettingsCache } from "~/core/lib/settings-cache";
import makeServerClient from "~/core/lib/supa-client.server";

import { saveSetting } from "../mutations";
import { getSetting } from "../queries";
import { settingSchema } from "../schema";

type FontSize = "default" | "large" | "larger";

export const meta: Route.MetaFunction = () => {
  return [{ title: `Setting | ${import.meta.env.VITE_APP_NAME}` }];
};

/**
 * 설정 데이터 로더
 */
export async function loader({ request }: Route.LoaderArgs) {
  const [client, headers] = makeServerClient(request);

  try {
    console.log("설정 로더 시작");

    // 현재 사용자 정보 가져오기
    const {
      data: { user },
      error: authError,
    } = await client.auth.getUser();

    if (authError || !user) {
      console.log("인증 오류:", authError);
      return {
        error: "인증되지 않은 사용자입니다.",
      };
    }

    console.log("사용자 ID:", user.id);

    // 설정 조회
    const settings = await getSetting(client, user.id);
    console.log("데이터베이스에서 로드한 설정:", settings);

    // 설정이 없는 경우 기본값 반환
    const defaultSettings = {
      theme: "dark" as const,
      fontSize: "default" as const,
      colorBlindMode: false,
    };

    const finalSettings = settings || defaultSettings;
    console.log("최종 반환할 설정:", finalSettings);

    return {
      success: true,
      data: finalSettings,
    };
  } catch (error) {
    console.error("설정 로드 중 오류:", error);
    return {
      error: "서버 오류가 발생했습니다.",
    };
  }
}

/**
 * 설정 저장 액션
 */
export async function action({ request }: Route.ActionArgs) {
  const [client, headers] = makeServerClient(request);

  try {
    console.log("설정 액션 시작");

    // 현재 사용자 정보 가져오기
    const {
      data: { user },
      error: authError,
    } = await client.auth.getUser();

    if (authError || !user) {
      console.log("인증 오류:", authError);
      return {
        error: "인증되지 않은 사용자입니다.",
      };
    }

    const formData = await request.formData();
    console.log("FormData:", Object.fromEntries(formData.entries()));

    // FormData에서 데이터 추출
    const rawData = {
      theme: formData.get("theme"),
      fontSize: formData.get("fontSize"),
      colorBlindMode: formData.get("colorBlindMode"),
    };

    console.log("추출된 데이터:", rawData);

    // Zod를 사용한 데이터 검증
    const validationResult = settingSchema.safeParse({
      theme: rawData.theme,
      fontSize: rawData.fontSize,
      colorBlindMode: rawData.colorBlindMode === "true",
    });

    if (!validationResult.success) {
      console.log("검증 실패:", validationResult.error.errors);
      return {
        error: "잘못된 데이터 형식입니다.",
        details: validationResult.error.errors,
      };
    }

    const { theme, fontSize, colorBlindMode } = validationResult.data;
    console.log("검증된 데이터:", { theme, fontSize, colorBlindMode });

    // 설정 저장
    await saveSetting(client, {
      userId: user.id,
      theme,
      fontSize,
      blindMode: colorBlindMode,
    });

    console.log("설정 저장 완료");

    // 캐시 무효화
    SettingsCache.invalidate(user.id);
    console.log("설정 캐시 무효화 완료:", user.id);

    return {
      success: true,
      message: "설정이 성공적으로 저장되었습니다.",
      data: { theme, fontSize, colorBlindMode },
      userId: user.id,
    };
  } catch (error) {
    console.error("설정 저장 중 오류:", error);
    return {
      error: "서버 오류가 발생했습니다.",
    };
  }
}

export default function Setting({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation();
  const [theme, setTheme] = useTheme();
  const fetcher = useFetcher();
  const navigate = useNavigate();

  // root에서 설정 데이터 가져오기
  const rootData = useRouteLoaderData("root");
  const settings = rootData?.userSettings;

  // 로컬 설정 상태 (즉시 UI 반영을 위해)
  const [localSettings, setLocalSettings] = useState(settings);

  // 로더 데이터가 변경되면 로컬 상태 업데이트
  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  console.log("설정 화면 - loaderData:", loaderData);
  console.log("설정 화면 - settings:", settings);

  // 오류 상태 관리
  const [themeError, setThemeError] = useState<string | null>(null);
  const [fontSizeError, setFontSizeError] = useState<string | null>(null);
  const [colorBlindError, setColorBlindError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // 설정 저장 후 캐시 무효화 및 전역 업데이트
  const handleSettingSave = async (newSettings: any) => {
    // 1. 로컬 상태 즉시 업데이트
    setLocalSettings(newSettings);

    // 2. 전역 설정 즉시 적용
    updateGlobalSettings(newSettings);

    // 3. 캐시 업데이트 (root loader 재실행 대신)
    if (rootData?.userSettings) {
      // 현재 사용자 ID를 가져오기 위해 root 데이터에서 추출
      // 실제로는 설정 저장 후 캐시가 무효화되므로 다음 페이지 로드 시 새로운 설정이 적용됨
      console.log("설정 변경 완료 - 캐시 무효화됨");
    }
  };

  // 테마 변경 핸들러
  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setThemeError(null);
    console.log("테마 변경 시작:", newTheme);

    // remix-themes 상태 업데이트만 수행
    if (newTheme === "system") {
      setTheme(null);
    } else if (newTheme === "light") {
      setTheme(Theme.LIGHT);
    } else {
      setTheme(Theme.DARK);
    }

    console.log("테마 변경 완료:", newTheme);
  };

  // 글꼴 크기 변경 핸들러
  const handleFontSizeChange = (newFontSize: FontSize) => {
    setFontSizeError(null);
    console.log("글꼴 크기 변경 시작:", newFontSize);

    // 즉시 UI 업데이트
    const newSettings = {
      fontSize: newFontSize,
      theme: localSettings?.theme || "dark",
      colorBlindMode: localSettings?.colorBlindMode || false,
    };
    handleSettingSave(newSettings);

    console.log("글꼴 크기 변경 완료:", newFontSize);
  };

  // 색약 모드 변경 핸들러
  const handleColorBlindModeChange = (newColorBlindMode: boolean) => {
    setColorBlindError(null);
    console.log("색약 모드 변경 시작:", newColorBlindMode);

    // 즉시 UI 업데이트
    const newSettings = {
      colorBlindMode: newColorBlindMode,
      theme: localSettings?.theme || "dark",
      fontSize: localSettings?.fontSize || "default",
    };
    handleSettingSave(newSettings);

    console.log("색약 모드 변경 완료:", newColorBlindMode);
  };

  // 전역 설정 업데이트 함수
  const updateGlobalSettings = (newSettings: any) => {
    // 기존 글꼴 크기 클래스 제거
    document.documentElement.classList.remove(
      "font-size-large",
      "font-size-larger",
    );

    // 글꼴 크기 적용 - CSS 클래스 사용
    if (newSettings.fontSize === "large") {
      document.documentElement.classList.add("font-size-large");
    } else if (newSettings.fontSize === "larger") {
      document.documentElement.classList.add("font-size-larger");
    }

    // 색약 모드 적용
    if (newSettings.colorBlindMode) {
      document.body.classList.add("colorblind-mode");
    } else {
      document.body.classList.remove("colorblind-mode");
    }

    console.log("전역 설정 업데이트 완료:", newSettings);
  };

  // fetcher 상태에 따른 처리
  useEffect(() => {
    if (fetcher.data?.success && fetcher.data?.data) {
      // 성공적으로 저장된 경우에만 로컬 상태 업데이트
      setLocalSettings(fetcher.data.data);
      updateGlobalSettings(fetcher.data.data);
    }

    if (fetcher.data?.error) {
      if (fetcher.data.error.includes("글꼴")) {
        setFontSizeError(fetcher.data.error);
      } else if (fetcher.data.error.includes("색약")) {
        setColorBlindError(fetcher.data.error);
      } else if (fetcher.data.error.includes("테마")) {
        setThemeError(fetcher.data.error);
      } else {
        setFontSizeError(fetcher.data.error);
      }
    }
  }, [fetcher.data]);

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
              className="flex h-auto w-full flex-col items-center gap-2 p-4"
            >
              <Sun className="h-6 w-6" />
              <span className="font-medium">라이트 모드</span>
              <span className="text-xs text-gray-500">밝은 테마</span>
            </Button>

            <Button
              variant={theme === Theme.DARK ? "default" : "outline"}
              onClick={() => handleThemeChange("dark")}
              className="flex h-auto w-full flex-col items-center gap-2 p-4"
            >
              <Moon className="h-6 w-6" />
              <span className="font-medium">다크 모드</span>
              <span className="text-xs text-gray-500">어두운 테마</span>
            </Button>

            <Button
              variant={theme === null ? "default" : "outline"}
              onClick={() => handleThemeChange("system")}
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
              onClick={() => handleFontSizeChange("default")}
              variant={
                localSettings?.fontSize === "default" ? "default" : "outline"
              }
              className="flex h-auto flex-col items-center gap-2 p-4"
            >
              <span className="text-base font-medium">기본</span>
              <span className="text-xs text-gray-500">16px</span>
            </Button>

            <Button
              onClick={() => handleFontSizeChange("large")}
              variant={
                localSettings?.fontSize === "large" ? "default" : "outline"
              }
              className="flex h-auto flex-col items-center gap-2 p-4"
            >
              <span className="text-base font-medium">크게</span>
              <span className="text-xs text-gray-500">18px</span>
            </Button>

            <Button
              onClick={() => handleFontSizeChange("larger")}
              variant={
                localSettings?.fontSize === "larger" ? "default" : "outline"
              }
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
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
              현재 선택된 글꼴 크기: {localSettings?.fontSize || "기본"}
            </p>
            <div className="mt-3 space-y-2">
              <p style={{ fontSize: "var(--font-size-base)" }}>
                기본 크기 텍스트 예시
              </p>
              <p style={{ fontSize: "var(--font-size-lg)" }}>
                큰 크기 텍스트 예시
              </p>
              <p style={{ fontSize: "var(--font-size-xl)" }}>
                더 큰 크기 텍스트 예시
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 색약 모드 설정 */}
      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            {localSettings?.colorBlindMode ? (
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
              onClick={() =>
                handleColorBlindModeChange(!localSettings?.colorBlindMode)
              }
              variant={localSettings?.colorBlindMode ? "default" : "outline"}
              className="flex items-center gap-2"
            >
              {localSettings?.colorBlindMode ? (
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

          {localSettings?.colorBlindMode && (
            <div className="rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                색약 모드가 활성화되었습니다. 모든 색상이 흑백으로 표시됩니다.
              </p>
            </div>
          )}

          {/* 색약 모드 미리보기 */}
          <div className="mt-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
              색상 미리보기:
            </p>
            <div className="flex gap-2">
              <div className="h-8 w-8 rounded bg-red-500"></div>
              <div className="h-8 w-8 rounded bg-green-500"></div>
              <div className="h-8 w-8 rounded bg-blue-500"></div>
              <div className="h-8 w-8 rounded bg-yellow-500"></div>
              <div className="h-8 w-8 rounded bg-purple-500"></div>
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
              {localSettings?.colorBlindMode
                ? "색약 모드 활성화: 모든 색상이 흑백으로 표시됩니다."
                : "일반 모드: 원래 색상이 표시됩니다."}
            </p>
          </div>
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
              {localSettings?.fontSize === "default"
                ? "기본"
                : localSettings?.fontSize === "large"
                  ? "크게"
                  : "더 크게"}
            </Badge>
            <Badge
              variant={localSettings?.colorBlindMode ? "default" : "secondary"}
              className="text-sm"
            >
              색약 모드: {localSettings?.colorBlindMode ? "활성화" : "비활성화"}
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
                <Button variant="destructive" size="lg" className="w-full">
                  <UserX className="mr-2 h-4 w-4" />
                  회원탈퇴
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
