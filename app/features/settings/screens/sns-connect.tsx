import {
  CheckCircle,
  ChevronRight,
  ExternalLink,
  Link,
  Unlink,
  XCircle,
} from "lucide-react";
import { useState } from "react";

import { Badge } from "~/core/components/ui/badge";
import { Button } from "~/core/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";

export default function SnsConnect() {
  const [connectedSNS, setConnectedSNS] = useState<string[]>(["threads"]); // 실제로는 API에서 가져올 값

  // SNS 플랫폼 데이터
  const snsPlatforms = [
    {
      id: "threads",
      name: "Threads",
      logo: "🧵",
      description: "Meta의 새로운 소셜 플랫폼",
      status: "available",
      callbackUrl: "/api/settings/threads-auth",
      features: ["홍보글 자동 업로드", "인게이지먼트 분석", "팔로워 통계"],
    },
    {
      id: "x",
      name: "X (Twitter)",
      logo: "🐦",
      description: "실시간 정보 공유 플랫폼",
      status: "available",
      callbackUrl:
        "https://twitter.com/i/oauth2/authorize?client_id=your_client_id&redirect_uri=your_callback_url&scope=tweet.read%20tweet.write%20users.read",
      features: ["홍보글 자동 업로드", "트렌드 분석", "리트윗 통계"],
    },
    {
      id: "instagram",
      name: "Instagram",
      logo: "📷",
      description: "시각적 콘텐츠 공유 플랫폼",
      status: "coming_soon",
      callbackUrl: "",
      features: ["스토리 자동 업로드", "인게이지먼트 분석", "팔로워 통계"],
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      logo: "💼",
      description: "전문가 네트워킹 플랫폼",
      status: "coming_soon",
      callbackUrl: "",
      features: ["프로페셔널 콘텐츠 업로드", "네트워크 분석", "업계 인사이트"],
    },
  ];

  const isConnected = (platformId: string) => {
    return connectedSNS.includes(platformId);
  };

  const handleConnect = (platform: any) => {
    if (platform.status === "coming_soon") {
      return;
    }

    if (isConnected(platform.id)) {
      // 연결 해제 로직
      setConnectedSNS((prev) => prev.filter((id) => id !== platform.id));
    } else {
      // 연결 로직 - 실제로는 OAuth 플로우를 시작
      window.open(platform.callbackUrl, "_blank", "width=600,height=600");
      // 연결 성공 후 상태 업데이트
      setConnectedSNS((prev) => [...prev, platform.id]);
    }
  };

  const getStatusBadge = (platform: any) => {
    if (platform.status === "coming_soon") {
      return <Badge variant="secondary">Coming Soon</Badge>;
    }

    if (isConnected(platform.id)) {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          연결됨
        </Badge>
      );
    } else {
      return <Badge variant="outline">연결 안됨</Badge>;
    }
  };

  const getActionButton = (platform: any) => {
    if (platform.status === "coming_soon") {
      return (
        <Button variant="outline" disabled size="sm">
          준비중
        </Button>
      );
    }

    if (isConnected(platform.id)) {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleConnect(platform)}
          className="text-red-600 hover:text-red-700"
        >
          <Unlink className="mr-1 h-4 w-4" />
          연결 해제
        </Button>
      );
    } else {
      return (
        <Button size="sm" onClick={() => handleConnect(platform)}>
          <Link className="mr-1 h-4 w-4" />
          연결하기
        </Button>
      );
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* 상단 헤더 */}
      <div>
        <h1 className="text-3xl font-bold">SNS 연결</h1>
        <p className="text-muted-foreground">
          소셜 미디어 플랫폼을 연결하여 홍보글을 자동으로 업로드하세요
        </p>
      </div>

      {/* 연결된 SNS 요약 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            연결 현황
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium">
                {connectedSNS.length}개 플랫폼 연결됨
              </span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-gray-400" />
              <span className="text-muted-foreground">
                {snsPlatforms.length - connectedSNS.length}개 미연결
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SNS 플랫폼 목록 */}
      <div className="space-y-4">
        {snsPlatforms.map((platform) => (
          <Card key={platform.id} className="transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                {/* 왼쪽: 로고와 정보 */}
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 text-2xl">
                    {platform.logo}
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{platform.name}</h3>
                      {getStatusBadge(platform)}
                    </div>
                    <p className="text-muted-foreground mb-2 text-sm">
                      {platform.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {platform.features.map((feature, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 오른쪽: 액션 버튼과 화살표 */}
                <div className="flex items-center gap-3">
                  {getActionButton(platform)}
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
        ))}
      </div>

      {/* 연결 가이드 */}
      <Card>
        <CardHeader>
          <CardTitle>연결 가이드</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h4 className="font-semibold">연결 방법</h4>
            <ol className="text-muted-foreground list-inside list-decimal space-y-2 text-sm">
              <li>연결하고 싶은 SNS 플랫폼의 "연결하기" 버튼을 클릭하세요.</li>
              <li>해당 플랫폼의 로그인 페이지로 이동합니다.</li>
              <li>계정 정보를 입력하고 권한을 승인하세요.</li>
              <li>연결이 완료되면 자동으로 홍보글을 업로드할 수 있습니다.</li>
            </ol>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">연결 해제</h4>
            <p className="text-muted-foreground text-sm">
              "연결 해제" 버튼을 클릭하면 언제든지 연결을 해제할 수 있습니다.
              연결 해제 후에는 해당 플랫폼으로 자동 업로드가 중단됩니다.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">권한 안내</h4>
            <p className="text-muted-foreground text-sm">
              연결 시 필요한 최소한의 권한만 요청합니다. 계정 정보나 개인
              메시지에는 접근하지 않으며, 오직 홍보글 업로드와 기본 통계
              확인만을 위한 권한을 요청합니다.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
