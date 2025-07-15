import type { LoaderFunctionArgs } from "react-router";

import { createClient } from "@supabase/supabase-js";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Building,
  FileText,
  Hash,
  Lightbulb,
  Plus,
  Search,
  Target,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { ToastContainer, toast } from "react-toastify";

import { Badge } from "~/core/components/ui/badge";
import { Button } from "~/core/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";
import { Input } from "~/core/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/core/components/ui/tabs";
import makeServerClient from "~/core/lib/supa-client.server";

import { saveInterestKeywords } from "../mutations";
import { getUserInterestKeywords } from "../queries";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const [client, headers] = makeServerClient(request);

    // 현재 사용자 확인
    const {
      data: { user },
      error: authError,
    } = await client.auth.getUser();

    if (authError || !user) {
      return { interestKeywords: [] };
    }

    // 사용자 프로필 ID 가져오기
    const { data: profile } = await client
      .from("profiles")
      .select("profile_id")
      .eq("profile_id", user.id)
      .single();

    if (!profile) {
      return { interestKeywords: [] };
    }

    // 사용자 관심 키워드 조회
    const keywords = await getUserInterestKeywords(client, profile.profile_id);

    return {
      interestKeywords: keywords.map((k) => k.keyword),
      headers,
    };
  } catch (error) {
    console.error("Error in trend-list loader:", error);
    return { interestKeywords: [] };
  }
}

export async function action({ request }: LoaderFunctionArgs) {
  if (request.method !== "POST") {
    return { success: false, message: "Method not allowed" };
  }

  try {
    const [client, headers] = makeServerClient(request);

    // 현재 사용자 확인
    const {
      data: { user },
      error: authError,
    } = await client.auth.getUser();

    if (authError || !user) {
      return { success: false, message: "인증이 필요합니다." };
    }

    // 사용자 프로필 ID 가져오기
    const { data: profile } = await client
      .from("profiles")
      .select("profile_id")
      .eq("profile_id", user.id)
      .single();

    if (!profile) {
      return { success: false, message: "사용자 프로필을 찾을 수 없습니다." };
    }

    // FormData 파싱
    const formData = await request.formData();
    const keywordsString = formData.get("keywords") as string;

    if (!keywordsString) {
      return { success: false, message: "키워드 데이터가 없습니다." };
    }

    let keywords: string[];
    try {
      keywords = JSON.parse(keywordsString);
    } catch (error) {
      return { success: false, message: "유효하지 않은 키워드 데이터입니다." };
    }

    if (!Array.isArray(keywords)) {
      return { success: false, message: "유효하지 않은 키워드 데이터입니다." };
    }

    // 키워드 저장
    const result = await saveInterestKeywords(
      client,
      profile.profile_id,
      keywords,
    );

    return result;
  } catch (error) {
    console.error("Error in trend-list action:", error);
    return {
      success: false,
      message: "키워드 저장 중 오류가 발생했습니다.",
      errors: [error instanceof Error ? error.message : "Unknown error"],
    };
  }
}

export default function TrendList({
  loaderData,
}: {
  loaderData: Awaited<ReturnType<typeof loader>>;
}) {
  const [interestKeywords, setInterestKeywords] = useState<string[]>(
    loaderData.interestKeywords || [],
  );
  const [newKeyword, setNewKeyword] = useState("");
  const fetcher = useFetcher();

  // fetcher 상태에 따른 toast 표시
  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.success) {
        toast.success(fetcher.data.message);
      } else {
        toast.error(fetcher.data.message || "키워드 저장에 실패했습니다.");
      }
    }
  }, [fetcher.data]);

  // 인기 키워드 데이터
  const trendingKeywords = [
    { keyword: "AI", growth: 45.2, mentions: 12500, category: "기술" },
    { keyword: "메타버스", growth: 23.8, mentions: 8900, category: "기술" },
    { keyword: "NFT", growth: -12.5, mentions: 6700, category: "기술" },
    { keyword: "블록체인", growth: 18.9, mentions: 5400, category: "기술" },
    { keyword: "클라우드", growth: 32.1, mentions: 4200, category: "기술" },
    { keyword: "IoT", growth: 15.7, mentions: 3800, category: "기술" },
    { keyword: "스타트업", growth: 28.4, mentions: 3200, category: "비즈니스" },
    { keyword: "창업", growth: 19.6, mentions: 2800, category: "비즈니스" },
    { keyword: "투자", growth: 41.3, mentions: 2500, category: "금융" },
    { keyword: "암호화폐", growth: -8.2, mentions: 2200, category: "금융" },
    { keyword: "ESG", growth: 67.8, mentions: 1900, category: "환경" },
    { keyword: "지속가능", growth: 55.4, mentions: 1600, category: "환경" },
    { keyword: "원격근무", growth: 12.3, mentions: 1400, category: "직장" },
    { keyword: "워라밸", growth: 33.7, mentions: 1200, category: "직장" },
    { keyword: "마케팅", growth: 26.9, mentions: 1100, category: "비즈니스" },
    { keyword: "브랜딩", growth: 38.5, mentions: 950, category: "비즈니스" },
    { keyword: "UX/UI", growth: 29.2, mentions: 880, category: "디자인" },
    { keyword: "데이터", growth: 47.1, mentions: 820, category: "기술" },
    { keyword: "보안", growth: 21.8, mentions: 750, category: "기술" },
    { keyword: "개인정보", growth: 34.6, mentions: 680, category: "기술" },
  ];

  // 산업별 트렌드 데이터
  const industryTrends = [
    {
      industry: "IT/기술",
      keywords: [
        { keyword: "AI", growth: 45.2, mentions: 12500 },
        { keyword: "클라우드", growth: 32.1, mentions: 4200 },
        { keyword: "블록체인", growth: 18.9, mentions: 5400 },
        { keyword: "IoT", growth: 15.7, mentions: 3800 },
        { keyword: "보안", growth: 21.8, mentions: 750 },
      ],
      totalGrowth: 26.7,
    },
    {
      industry: "금융",
      keywords: [
        { keyword: "투자", growth: 41.3, mentions: 2500 },
        { keyword: "암호화폐", growth: -8.2, mentions: 2200 },
        { keyword: "핀테크", growth: 28.9, mentions: 1800 },
        { keyword: "주식", growth: 15.4, mentions: 1200 },
        { keyword: "펀드", growth: 12.7, mentions: 950 },
      ],
      totalGrowth: 18.0,
    },
    {
      industry: "비즈니스",
      keywords: [
        { keyword: "스타트업", growth: 28.4, mentions: 3200 },
        { keyword: "창업", growth: 19.6, mentions: 2800 },
        { keyword: "마케팅", growth: 26.9, mentions: 1100 },
        { keyword: "브랜딩", growth: 38.5, mentions: 950 },
        { keyword: "전략", growth: 22.3, mentions: 850 },
      ],
      totalGrowth: 27.1,
    },
    {
      industry: "환경",
      keywords: [
        { keyword: "ESG", growth: 67.8, mentions: 1900 },
        { keyword: "지속가능", growth: 55.4, mentions: 1600 },
        { keyword: "친환경", growth: 42.1, mentions: 1200 },
        { keyword: "탄소중립", growth: 38.9, mentions: 980 },
        { keyword: "재생에너지", growth: 31.5, mentions: 750 },
      ],
      totalGrowth: 47.1,
    },
    {
      industry: "직장",
      keywords: [
        { keyword: "원격근무", growth: 12.3, mentions: 1400 },
        { keyword: "워라밸", growth: 33.7, mentions: 1200 },
        { keyword: "직장문화", growth: 25.8, mentions: 950 },
        { keyword: "성과관리", growth: 18.4, mentions: 720 },
        { keyword: "리더십", growth: 16.9, mentions: 680 },
      ],
      totalGrowth: 21.4,
    },
  ];

  // 내 글과의 매칭 데이터
  const myPostMatching = {
    usedKeywords: [
      { keyword: "AI", matchScore: 95, trendRank: 1 },
      { keyword: "협업", matchScore: 78, trendRank: 15 },
      { keyword: "팀워크", matchScore: 82, trendRank: 12 },
      { keyword: "기술발전", matchScore: 65, trendRank: 25 },
      { keyword: "창업", matchScore: 88, trendRank: 8 },
    ],
    overallMatchScore: 82,
    recommendations: [
      "AI 관련 키워드를 더 활용하면 트렌드 매칭도가 높아집니다",
      "ESG, 지속가능 키워드를 추가해보세요 (높은 성장률)",
      "투자, 마케팅 키워드도 고려해보세요",
      "메타버스 관련 내용을 추가하면 더 많은 관심을 받을 수 있습니다",
    ],
    topTrendingKeywords: ["ESG", "지속가능", "투자", "마케팅", "메타버스"],
  };

  const formatGrowth = (growth: number) => {
    const isPositive = growth >= 0;
    return (
      <div
        className={`flex items-center gap-1 ${isPositive ? "text-green-600" : "text-red-600"}`}
      >
        {isPositive ? (
          <ArrowUpRight className="h-3 w-3" />
        ) : (
          <ArrowDownRight className="h-3 w-3" />
        )}
        <span className="text-xs font-medium">
          {Math.abs(growth).toFixed(1)}%
        </span>
      </div>
    );
  };

  const formatMentions = (mentions: number) => {
    if (mentions >= 10000) return `${(mentions / 1000).toFixed(1)}K`;
    if (mentions >= 1000) return `${(mentions / 1000).toFixed(1)}K`;
    return mentions.toString();
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !interestKeywords.includes(newKeyword.trim())) {
      setInterestKeywords([...interestKeywords, newKeyword.trim()]);
      setNewKeyword("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setInterestKeywords(interestKeywords.filter((k) => k !== keyword));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addKeyword();
    }
  };

  const handleSaveKeywords = () => {
    if (interestKeywords.length === 0) {
      toast.warning("저장할 키워드가 없습니다.");
      return;
    }

    fetcher.submit(
      { keywords: JSON.stringify(interestKeywords) },
      { method: "post" },
    );
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Toast Container */}
      <ToastContainer />

      {/* 상단 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">트렌드 분석</h1>
          <p className="text-muted-foreground">트렌드와 키워드 분석</p>
        </div>
      </div>

      {/* 관심 키워드 입력 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            관심 키워드 설정
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            관심 있는 키워드를 설정하면 매일 아침 해당 키워드 기반으로 트렌드를
            분석해드립니다. 평소 자주 사용하는 단어나 관심 있는 주제를
            입력해주세요.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 키워드 입력 */}
            <div className="flex gap-2">
              <Input
                placeholder="예: AI, 마케팅, 스타트업, 브랜딩..."
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={addKeyword} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* 입력된 키워드 목록 */}
            {interestKeywords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {interestKeywords.map((keyword, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {keyword}
                    <button
                      onClick={() => removeKeyword(keyword)}
                      className="ml-1 rounded-full p-0.5 hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* 저장 버튼 */}
            {interestKeywords.length > 0 && (
              <Button
                className="w-full"
                onClick={handleSaveKeywords}
                disabled={fetcher.state === "submitting"}
              >
                {fetcher.state === "submitting"
                  ? "저장 중..."
                  : "관심 키워드 저장"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 인기 키워드 */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              인기 키워드 TOP 20
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {trendingKeywords.map((item, index) => (
                <div
                  key={index}
                  className="rounded-lg border p-4 transition-shadow hover:shadow-md"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-500">
                        #{index + 1}
                      </span>
                      <Badge variant="outline" className="text-sm">
                        {item.keyword}
                      </Badge>
                    </div>
                    {formatGrowth(item.growth)}
                  </div>
                  <div className="text-muted-foreground flex items-center justify-between text-sm">
                    <span>언급 {formatMentions(item.mentions)}회</span>
                    <Badge variant="secondary" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
