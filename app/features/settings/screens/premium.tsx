import {
  BarChart3,
  Calendar,
  Check,
  Crown,
  Gift,
  Shield,
  Star,
  Target,
  TrendingUp,
  Users,
  X,
  Zap,
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

interface CurrentPlan {
  type: "free" | "premium";
  startDate: Date;
  endDate: Date | null;
  autoRenew: boolean;
}

interface PlanInfo {
  name: string;
  status: "active" | "expired";
  daysLeft: number | null;
  endDate: Date | null;
}

export default function Premium() {
  const [currentPlan, setCurrentPlan] = useState<CurrentPlan>({
    type: "free", // "free" | "premium"
    startDate: new Date("2024-01-01"),
    endDate: null, // 프리미엄인 경우에만 설정
    autoRenew: false,
  });

  // 요금제 비교 데이터
  const plans = [
    {
      id: "free",
      name: "Free",
      price: "무료",
      description: "기본 기능을 무료로 이용하세요",
      features: [
        { name: "일일 홍보글 생성", included: true, premium: false },
        { name: "기본 AI 분석", included: true, premium: false },
        { name: "1개 SNS 플랫폼 연결", included: true, premium: false },
        { name: "기본 통계", included: true, premium: false },
        { name: "챌린지 참여", included: true, premium: false },
        { name: "고급 AI 분석", included: false, premium: true },
        { name: "무제한 SNS 연결", included: false, premium: true },
        { name: "상세 성과 분석", included: false, premium: true },
        { name: "우선 고객 지원", included: false, premium: true },
        { name: "고급 템플릿", included: false, premium: true },
        { name: "배치 업로드", included: false, premium: true },
        { name: "API 접근", included: false, premium: true },
      ],
    },
    {
      id: "premium",
      name: "Premium",
      price: "₩5,000",
      period: "/월",
      description: "모든 기능을 제한 없이 이용하세요",
      popular: true,
      features: [
        { name: "일일 홍보글 생성", included: true, premium: false },
        { name: "기본 AI 분석", included: true, premium: false },
        { name: "1개 SNS 플랫폼 연결", included: true, premium: false },
        { name: "기본 통계", included: true, premium: false },
        { name: "챌린지 참여", included: true, premium: false },
        { name: "고급 AI 분석", included: true, premium: true },
        { name: "무제한 SNS 연결", included: true, premium: true },
        { name: "상세 성과 분석", included: true, premium: true },
        { name: "우선 고객 지원", included: true, premium: true },
        { name: "고급 템플릿", included: true, premium: true },
        { name: "배치 업로드", included: true, premium: true },
        { name: "API 접근", included: true, premium: true },
      ],
    },
  ];

  const getCurrentPlanInfo = (): PlanInfo => {
    if (currentPlan.type === "premium" && currentPlan.endDate) {
      const daysLeft = Math.ceil(
        (currentPlan.endDate.getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24),
      );
      return {
        name: "Premium",
        status: daysLeft > 0 ? "active" : "expired",
        daysLeft: daysLeft,
        endDate: currentPlan.endDate,
      };
    }
    return {
      name: "Free",
      status: "active",
      daysLeft: null,
      endDate: null,
    };
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleUpgrade = () => {
    // 결제 페이지로 이동하는 로직
    console.log("Premium으로 업그레이드");
  };

  const handleCancel = () => {
    // 구독 취소 로직
    console.log("구독 취소");
  };

  const currentPlanInfo = getCurrentPlanInfo();

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* 상단 헤더 */}
      <div>
        <h1 className="text-3xl font-bold">요금제</h1>
        <p className="text-muted-foreground">나에게 맞는 요금제를 선택하세요</p>
      </div>

      {/* 현재 요금제 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            현재 요금제
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                  currentPlanInfo.name === "Premium"
                    ? "bg-gradient-to-br from-yellow-100 to-orange-100"
                    : "bg-gradient-to-br from-blue-100 to-purple-100"
                }`}
              >
                {currentPlanInfo.name === "Premium" ? (
                  <Crown className="h-6 w-6 text-yellow-600" />
                ) : (
                  <Star className="h-6 w-6 text-blue-600" />
                )}
              </div>
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <h3 className="text-lg font-semibold">
                    {currentPlanInfo.name}
                  </h3>
                  <Badge
                    className={
                      currentPlanInfo.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {currentPlanInfo.status === "active" ? "활성" : "만료"}
                  </Badge>
                </div>
                {currentPlanInfo.name === "Premium" &&
                  currentPlanInfo.daysLeft !== null &&
                  currentPlanInfo.endDate && (
                    <p className="text-muted-foreground text-sm">
                      {currentPlanInfo.daysLeft > 0
                        ? `${currentPlanInfo.daysLeft}일 남음 (${formatDate(currentPlanInfo.endDate)})`
                        : `${formatDate(currentPlanInfo.endDate)}에 만료됨`}
                    </p>
                  )}
              </div>
            </div>
            <div className="flex gap-2">
              {currentPlanInfo.name === "Free" ? (
                <Button onClick={handleUpgrade}>
                  <Crown className="mr-2 h-4 w-4" />
                  Premium으로 업그레이드
                </Button>
              ) : (
                <Button variant="outline" onClick={handleCancel}>
                  구독 취소
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 요금제 비교 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative ${plan.popular ? "ring-2 ring-yellow-500" : ""}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
                <Badge className="bg-yellow-500 px-3 py-1 text-white">
                  <Star className="mr-1 h-3 w-3" />
                  인기
                </Badge>
              </div>
            )}
            <CardHeader className="pb-4 text-center">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="flex items-center justify-center gap-1">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-muted-foreground">{plan.period}</span>
                )}
              </div>
              <p className="text-muted-foreground">{plan.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{feature.name}</span>
                      {feature.premium && (
                        <Badge variant="outline" className="text-xs">
                          Premium
                        </Badge>
                      )}
                    </div>
                    {feature.included ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-4">
                {plan.id === "free" ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={currentPlan.type === "free"}
                  >
                    {currentPlan.type === "free"
                      ? "현재 요금제"
                      : "Free로 변경"}
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={handleUpgrade}
                    disabled={
                      currentPlan.type === "premium" &&
                      currentPlanInfo.status === "active"
                    }
                  >
                    {currentPlan.type === "premium" &&
                    currentPlanInfo.status === "active"
                      ? "현재 요금제"
                      : "Premium으로 업그레이드"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 프리미엄 혜택 상세 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Premium 혜택 상세
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="mb-1 font-semibold">고급 AI 분석</h4>
                <p className="text-muted-foreground text-sm">
                  더 정교한 AI 분석으로 브랜드에 최적화된 홍보글을 생성합니다.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="mb-1 font-semibold">무제한 SNS 연결</h4>
                <p className="text-muted-foreground text-sm">
                  원하는 만큼 많은 SNS 플랫폼을 연결하여 효율적으로 관리하세요.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="mb-1 font-semibold">상세 성과 분석</h4>
                <p className="text-muted-foreground text-sm">
                  업로드된 홍보글의 성과를 상세하게 분석하고 개선점을
                  제시합니다.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                <Target className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h4 className="mb-1 font-semibold">고급 템플릿</h4>
                <p className="text-muted-foreground text-sm">
                  다양한 산업군과 목적에 맞는 전문적인 홍보글 템플릿을
                  제공합니다.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                <TrendingUp className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h4 className="mb-1 font-semibold">배치 업로드</h4>
                <p className="text-muted-foreground text-sm">
                  여러 홍보글을 한 번에 작성하고 연결된 모든 SNS에 자동으로
                  업로드합니다.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
                <Shield className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="mb-1 font-semibold">우선 고객 지원</h4>
                <p className="text-muted-foreground text-sm">
                  Premium 고객을 위한 우선 지원으로 빠른 문제 해결을 보장합니다.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>자주 묻는 질문</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h4 className="font-semibold">
              언제든지 요금제를 변경할 수 있나요?
            </h4>
            <p className="text-muted-foreground text-sm">
              네, 언제든지 Free와 Premium 요금제 간에 변경할 수 있습니다.
              Premium에서 Free로 변경 시 다음 결제일부터 적용됩니다.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">
              Premium 구독을 취소하면 어떻게 되나요?
            </h4>
            <p className="text-muted-foreground text-sm">
              구독 취소 시 현재 결제 기간이 끝날 때까지 Premium 기능을 계속
              이용할 수 있습니다. 기간 종료 후에는 Free 요금제로 자동
              변경됩니다.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">환불 정책은 어떻게 되나요?</h4>
            <p className="text-muted-foreground text-sm">
              구독 시작 후 7일 이내에 환불 요청 시 전액 환불해드립니다. 7일
              이후에는 부분 환불이 불가능합니다.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
