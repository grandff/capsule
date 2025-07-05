import type { SnsPlatform } from "../types/settings-type";

import { useEffect, useState } from "react";
import {
  type LoaderFunctionArgs,
  useFetcher,
  useLoaderData,
} from "react-router";
import { ToastContainer, toast } from "react-toastify";

import makeServerClient from "~/core/lib/supa-client.server";
import { getConnectionStatus } from "~/features/settings/queries";

import ConnectionGuide from "../components/connection-guide";
import SnsPlatformSection from "../components/sns-platform-section";
import SnsStatus from "../components/sns-status";
import { isConnected } from "../utils/sns-connect-util";

// SVG 로고 컴포넌트들
const ThreadsLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="250"
    height="250"
    viewBox="0 0 50 50"
  >
    <path d="M46,9v32c0,2.757-2.243,5-5,5H9c-2.757,0-5-2.243-5-5V9c0-2.757,2.243-5,5-5h32C43.757,4,46,6.243,46,9z M33.544,35.913	c2.711-2.708,2.635-6.093,1.746-8.17c-0.54-1.255-1.508-2.33-2.798-3.108l-0.223-0.138c-0.33-0.208-0.609-0.375-1.046-0.542	c-0.008-0.278-0.025-0.556-0.058-0.807c-0.59-4.561-3.551-5.535-5.938-5.55c-2.154,0-3.946,0.92-5.044,2.592l1.672,1.098	c0.736-1.121,1.871-1.689,3.366-1.689c2.367,0.015,3.625,1.223,3.96,3.801c-1.141-0.231-2.426-0.314-3.807-0.233	c-3.924,0.226-5.561,2.591-5.442,4.836c0.134,2.486,2.278,4.222,5.216,4.222c0.13,0,0.259-0.003,0.384-0.011	c2.297-0.126,5.105-1.29,5.61-6.063c0.021,0.013,0.041,0.026,0.062,0.039l0.253,0.157c0.932,0.562,1.621,1.317,1.994,2.185	c0.643,1.501,0.682,3.964-1.322,5.966c-1.732,1.73-3.812,2.479-6.936,2.502c-3.47-0.026-6.099-1.145-7.812-3.325	c-1.596-2.028-2.42-4.953-2.451-8.677c0.031-3.728,0.855-6.646,2.451-8.673c1.714-2.181,4.349-3.299,7.814-3.325	c3.492,0.026,6.165,1.149,7.944,3.338c0.864,1.063,1.525,2.409,1.965,3.998l1.928-0.532c-0.514-1.858-1.301-3.449-2.341-4.728	c-2.174-2.674-5.363-4.045-9.496-4.076c-4.12,0.031-7.278,1.406-9.387,4.089c-1.875,2.383-2.844,5.712-2.879,9.91	c0.035,4.193,1.004,7.529,2.879,9.913c2.109,2.682,5.262,4.058,9.385,4.088C28.857,38.973,31.433,38.021,33.544,35.913z M28.993,25.405c0.07,0.016,0.138,0.031,0.202,0.046c-0.005,0.078-0.01,0.146-0.015,0.198c-0.314,3.928-2.295,4.489-3.761,4.569	c-0.091,0.005-0.181,0.008-0.271,0.008c-1.851,0-3.144-0.936-3.218-2.329c-0.065-1.218,0.836-2.576,3.561-2.732	c0.297-0.018,0.589-0.027,0.875-0.027C27.325,25.137,28.209,25.227,28.993,25.405z"></path>
  </svg>
);

const XLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="150"
    height="150"
    viewBox="0 0 50 50"
  >
    <path d="M 11 4 C 7.134 4 4 7.134 4 11 L 4 39 C 4 42.866 7.134 46 11 46 L 39 46 C 42.866 46 46 42.866 46 39 L 46 11 C 46 7.134 42.866 4 39 4 L 11 4 z M 13.085938 13 L 21.023438 13 L 26.660156 21.009766 L 33.5 13 L 36 13 L 27.789062 22.613281 L 37.914062 37 L 29.978516 37 L 23.4375 27.707031 L 15.5 37 L 13 37 L 22.308594 26.103516 L 13.085938 13 z M 16.914062 15 L 31.021484 35 L 34.085938 35 L 19.978516 15 L 16.914062 15 z"></path>
  </svg>
);

// loader function
// threads-callback으로 부터 platform과 status를 받음
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const platform = url.searchParams.get("platform");
  const status = url.searchParams.get("status");

  // 실제 연결 상태 가져오기
  const [client, headers] = makeServerClient(request);

  try {
    // 현재 사용자 ID 가져오기 (실제로는 인증된 사용자 ID를 사용해야 함)
    const {
      data: { user },
    } = await client.auth.getUser();

    if (!user) {
      return { platform, status, connectedSNS: [] };
    }

    const connectionStatus = await getConnectionStatus(client, user.id);
    const connectedList = [];
    if (connectionStatus.threadsConnected) {
      connectedList.push("threads");
    }

    return {
      platform,
      status,
      connectedSNS: connectedList,
      headers,
    };
  } catch (error) {
    console.error("Error fetching connection status:", error);
    return { platform, status, connectedSNS: [], headers };
  }
}

export default function SnsConnect() {
  const { platform, status, connectedSNS } = useLoaderData<typeof loader>();
  const [connectedSNSArray, setConnectedSNSArray] = useState<string[]>(
    Array.isArray(connectedSNS) ? connectedSNS : [],
  );
  const [showAlert, setShowAlert] = useState(false);
  const [disconnectPlatform, setDisconnectPlatform] = useState<string | null>(
    null,
  );
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(
    null,
  );
  const fetcher = useFetcher();

  // status가 있으면 Alert 표시
  useEffect(() => {
    if (status === "success") {
      toast.success(`${platform} 계정이 성공적으로 연결되었습니다!`);
    } else if (status === "error" && platform) {
      toast.error(`${platform} 계정 연결에 실패했습니다. 다시 시도해주세요.`);
    }
  }, [status, platform]);

  // 연결 해제 확인 다이얼로그 열기
  const handleDisconnectConfirm = (platformId: string) => {
    setDisconnectPlatform(platformId);
  };

  // 연결 해제 실행
  const handleDisconnect = async () => {
    if (disconnectPlatform) {
      try {
        // 서버에 연결 해제 요청
        console.log(disconnectPlatform);
        fetcher.submit(
          { platform: disconnectPlatform },
          { method: "post", action: "/api/settings/disconnect" },
        );

        // 로컬 상태 즉시 업데이트 (즉시 UI 반영)
        setConnectedSNSArray((prev) =>
          prev.filter((id) => id !== disconnectPlatform),
        );
        setDisconnectPlatform(null);
      } catch (error) {
        console.error("Error disconnecting platform:", error);
        alert("연결 해제 중 오류가 발생했습니다.");
      }
    }
  };

  // 연결 해제 취소
  const handleDisconnectCancel = () => {
    setDisconnectPlatform(null);
  };

  // SNS 플랫폼 데이터
  const snsPlatforms: SnsPlatform[] = [
    {
      id: "threads",
      name: "Threads",
      logo: <ThreadsLogo />,
      description: "Meta의 새로운 소셜 플랫폼",
      status: "available",
      callbackUrl: "/api/settings/threads-auth",
      features: ["홍보글 자동 업로드", "인게이지먼트 분석", "팔로워 통계"],
    },
    {
      id: "x",
      name: "X (Twitter)",
      logo: <XLogo />,
      description: "실시간 정보 공유 플랫폼",
      status: "coming_soon",
      callbackUrl:
        "https://twitter.com/i/oauth2/authorize?client_id=your_client_id&redirect_uri=your_callback_url&scope=tweet.read%20tweet.write%20users.read",
      features: ["홍보글 자동 업로드", "트렌드 분석", "리트윗 통계"],
    },
  ];

  const handleConnect = (platform: SnsPlatform) => {
    if (platform.status === "coming_soon") {
      return;
    }

    if (isConnected(connectedSNSArray, platform.id)) {
      // 이미 연결되어 있다면 연결 해제 확인 다이얼로그 열기
      handleDisconnectConfirm(platform.id);
    } else {
      // 연결되지 않은 상태라면 OAuth 플로우 시작
      setConnectingPlatform(platform.id);
      location.href = platform.callbackUrl;
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Alert 메시지 */}
      {/* TODO 에러 메시지를 받았을 때 처리가 필요함 */}
      <ToastContainer />
      {/* 상단 헤더 */}
      <div>
        <h1 className="text-3xl font-bold">SNS 연결</h1>
        <p className="text-muted-foreground">
          소셜 미디어 플랫폼을 연결하여 홍보글을 자동으로 업로드하세요
        </p>
      </div>

      {/* 연결된 SNS 요약 */}
      <SnsStatus
        connectedSNSArray={connectedSNSArray}
        snsPlatforms={snsPlatforms}
      />

      {/* SNS 플랫폼 목록 */}
      <div className="space-y-4">
        {snsPlatforms.map((platform) => (
          <SnsPlatformSection
            key={platform.id}
            platform={platform}
            connectedSNSArray={connectedSNSArray}
            disconnectPlatform={disconnectPlatform ?? ""}
            connectingPlatform={connectingPlatform ?? ""}
            handleDisconnectCancel={handleDisconnectCancel}
            handleDisconnect={handleDisconnect}
            handleConnect={handleConnect}
          />
        ))}
      </div>

      {/* 연결 가이드 */}
      <ConnectionGuide />
    </div>
  );
}
