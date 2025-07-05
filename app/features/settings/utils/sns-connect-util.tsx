import type { SnsPlatform } from "../types/settings-type";

import { AlertDialog } from "@radix-ui/react-alert-dialog";
import { Link, Unlink } from "lucide-react";

import {
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

export const isConnected = (
  connectedSNSArray: string[],
  platformId: string,
) => {
  return connectedSNSArray.includes(platformId);
};

export const getStatusBadge = (
  connectedSNSArray: string[],
  platform: SnsPlatform,
) => {
  if (platform.status === "coming_soon") {
    return <Badge variant="secondary">Coming Soon</Badge>;
  }

  if (isConnected(connectedSNSArray, platform.id)) {
    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        연결됨
      </Badge>
    );
  } else {
    return <Badge variant="outline">연결 안됨</Badge>;
  }
};

export const getActionButton = (
  connectedSNSArray: string[],
  platform: SnsPlatform,
  disconnectPlatform: string,
  connectingPlatform: string,
  handleDisconnectCancel: () => void,
  handleDisconnect: () => void,
  handleConnect: (platform: SnsPlatform) => void,
) => {
  if (platform.status === "coming_soon") {
    return (
      <Button variant="outline" disabled size="sm">
        준비중
      </Button>
    );
  }

  if (isConnected(connectedSNSArray, platform.id)) {
    return (
      <AlertDialog
        open={disconnectPlatform === platform.id}
        onOpenChange={(open) => !open && handleDisconnectCancel()}
      >
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700"
          >
            <Unlink className="mr-1 h-4 w-4" />
            연결 해제
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>연결 해제 확인</AlertDialogTitle>
            <AlertDialogDescription>
              {platform.name} 계정과의 연결을 해제하시겠습니까? 연결 해제 후에는
              해당 플랫폼으로 자동 업로드가 중단됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDisconnectCancel}>
              취소
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDisconnect}
              className="bg-red-600 hover:bg-red-700"
            >
              연결 해제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  } else {
    const isConnecting = connectingPlatform === platform.id;
    return (
      <Button
        size="sm"
        onClick={() => handleConnect(platform)}
        disabled={isConnecting}
      >
        {isConnecting ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            연결 중...
          </>
        ) : (
          <>
            <Link className="mr-1 h-4 w-4" />
            연결하기
          </>
        )}
      </Button>
    );
  }
};
