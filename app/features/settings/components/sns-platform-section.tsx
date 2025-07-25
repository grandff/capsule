import type { SnsPlatform } from "../types/settings-type";

import { ChevronRight } from "lucide-react";

import { Button } from "~/core/components/ui/button";
import { Card, CardContent } from "~/core/components/ui/card";

import { getActionButton, getStatusBadge } from "../utils/sns-connect-util";

export default function SnsPlatformSection({
  platform,
  connectedSNSArray,
  disconnectPlatform,
  connectingPlatform,
  handleDisconnectCancel,
  handleDisconnect,
  handleConnect,
}: {
  platform: SnsPlatform;
  connectedSNSArray: string[];
  disconnectPlatform: string;
  connectingPlatform: string;
  handleDisconnectCancel: () => void;
  handleDisconnect: () => void;
  handleConnect: (platform: SnsPlatform) => void;
}) {
  return (
    <Card key={platform.id} className="transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* 왼쪽: 로고와 정보 */}
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 text-gray-700">
              {platform.logo}
            </div>
            <div className="flex-1">
              <div className="mb-1 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <h3 className="text-lg font-semibold">{platform.name}</h3>
                {getStatusBadge(connectedSNSArray, platform)}
              </div>
            </div>
          </div>

          {/* 오른쪽: 액션 버튼과 화살표 */}
          <div className="flex items-center gap-3">
            {getActionButton(
              connectedSNSArray,
              platform,
              disconnectPlatform,
              connectingPlatform,
              handleDisconnectCancel,
              handleDisconnect,
              handleConnect,
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleConnect(platform)}
              disabled={platform.status === "coming_soon"}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
