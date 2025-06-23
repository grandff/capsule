import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Building,
  Calendar,
  FileText,
  Hash,
  Lightbulb,
  Search,
  Target,
  TrendingDown,
  TrendingUp,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/core/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/core/components/ui/tabs";

export default function TrendList() {
  const [selectedPeriod, setSelectedPeriod] = useState("today");

  // 기간 옵션
  const periodOptions = [
    { value: "today", label: "오늘" },
    { value: "week", label: "이번 주" },
    { value: "month", label: "이번 달" },
    { value: "custom", label: "직접 선택" },
  ];

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

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">트렌드 분석</h1>
          <p className="text-muted-foreground">실시간 트렌드와 키워드 분석</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <Tabs defaultValue="keywords" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="keywords" className="flex items-center gap-2">
            <Hash className="h-4 w-4" />
            인기 키워드
          </TabsTrigger>
          <TabsTrigger value="industry" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            산업별 트렌드
          </TabsTrigger>
          <TabsTrigger value="matching" className="flex items-center gap-2">
            <Target className="h-4 w-4" />내 글 매칭
          </TabsTrigger>
        </TabsList>

        {/* 인기 키워드 탭 */}
        <TabsContent value="keywords" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                실시간 인기 키워드 TOP 20
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
        </TabsContent>

        {/* 산업별 트렌드 탭 */}
        <TabsContent value="industry" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {industryTrends.map((industry, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      {industry.industry}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-sm">
                        성장률
                      </span>
                      {formatGrowth(industry.totalGrowth)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {industry.keywords.map((keyword, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded bg-gray-50 p-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {keyword.keyword}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {formatMentions(keyword.mentions)}회
                          </span>
                        </div>
                        {formatGrowth(keyword.growth)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 내 글 매칭 탭 */}
        <TabsContent value="matching" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* 내 글 매칭도 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />내 글 트렌드 매칭도
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6 text-center">
                  <div className="mb-2 text-4xl font-bold text-blue-600">
                    {myPostMatching.overallMatchScore}%
                  </div>
                  <div className="mb-4 h-3 w-full rounded-full bg-gray-200">
                    <div
                      className="h-3 rounded-full bg-blue-600"
                      style={{ width: `${myPostMatching.overallMatchScore}%` }}
                    />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    현재 트렌드와의 일치도
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">사용한 키워드</h4>
                  {myPostMatching.usedKeywords.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded bg-gray-50 p-2"
                    >
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {item.keyword}
                        </Badge>
                        <span className="text-muted-foreground text-xs">
                          트렌드 #{item.trendRank}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">
                          {item.matchScore}%
                        </span>
                        <div className="h-1 w-12 rounded-full bg-gray-200">
                          <div
                            className="h-1 rounded-full bg-green-500"
                            style={{ width: `${item.matchScore}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 추천사항 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  트렌드 활용 제안
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="mb-2 text-sm font-semibold">추천 키워드</h4>
                    <div className="flex flex-wrap gap-2">
                      {myPostMatching.topTrendingKeywords.map(
                        (keyword, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            #{keyword}
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-2 text-sm font-semibold">개선 제안</h4>
                    <ul className="space-y-2">
                      {myPostMatching.recommendations.map((rec, index) => (
                        <li
                          key={index}
                          className="text-muted-foreground flex items-start gap-2 text-sm"
                        >
                          <span className="mt-0.5 text-blue-500">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t pt-4">
                    <Button className="w-full">
                      <FileText className="mr-2 h-4 w-4" />
                      새로운 글 작성하기
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
