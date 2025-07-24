import { BorderBeam } from "components/magicui/border-beam";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

import { Button } from "~/core/components/ui/button";
import { Card, CardContent } from "~/core/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/core/components/ui/dialog";
import { Separator } from "~/core/components/ui/separator";

import { InterestKeywordsWidget } from "./interest-keywords-widget";
import { SnsConnectWidget } from "./sns-connect-widget";

interface OnboardingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  isThreadsConnected?: boolean;
  isOnboardingLoading?: boolean;
  isCloseLoading?: boolean;
}

export function OnboardingDialog({
  isOpen,
  onClose,
  onComplete,
  isThreadsConnected = false,
  isOnboardingLoading = false,
  isCloseLoading = false,
}: OnboardingDialogProps) {
  const [searchParams] = useSearchParams();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // URL 파라미터에서 threads 연결 상태 확인
  useEffect(() => {
    const platform = searchParams.get("platform");
    const status = searchParams.get("status");

    if (platform === "threads" && status === "success") {
      setShowSuccessMessage(true);
      // URL 파라미터 정리
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("platform");
      newUrl.searchParams.delete("status");
      window.history.replaceState({}, "", newUrl.toString());
    }
  }, [searchParams]);
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="max-w-2xl"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            어떻게 써야할지 알려드릴게요!
          </DialogTitle>
        </DialogHeader>

        <Card>
          <BorderBeam
            size={100}
            duration={4}
            colorFrom="#10b981"
            colorTo="#059669"
            className="rounded-lg"
          />
          <CardContent className="space-y-6 p-6">
            <div className="space-y-4">
              <p className="text-base">
                Capsule에서 작성한 글을 SNS에 업로드하기 위해 계정을
                연결해주세요! (현재는 쓰레드만 지원하고 있습니다)
              </p>
              <SnsConnectWidget
                isConnected={isThreadsConnected || showSuccessMessage}
                showSuccessMessage={showSuccessMessage}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <p className="text-base">
                관심있는 키워드를 입력해주시면 매주 트렌드를 검색해서
                알려드려요.
              </p>
              <InterestKeywordsWidget />
            </div>
          </CardContent>
        </Card>

        {/* 하단 버튼 */}
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isCloseLoading || isOnboardingLoading}
          >
            {isCloseLoading && (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            )}
            다음에 할게요
          </Button>
          <Button
            onClick={onComplete}
            disabled={isOnboardingLoading || isCloseLoading}
          >
            {isOnboardingLoading && (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            )}
            다했어요
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
