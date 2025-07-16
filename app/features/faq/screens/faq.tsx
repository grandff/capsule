import type { Route } from "./+types/faq";

import { HelpCircle } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/core/components/ui/accordion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/core/components/ui/card";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "자주 묻는 질문 (FAQ) - Capsule" },
    {
      name: "description",
      content: "Capsule 서비스에 대한 자주 묻는 질문들을 확인하세요.",
    },
  ];
};

export function loader({}: Route.LoaderArgs) {
  return {};
}

const faqData = {
  signup: [
    {
      question: "회원가입은 어떻게 하나요?",
      answer:
        "현재는 SNS 계정으로 간편하게 로그인할 수 있어요. 구글, 애플, 카카오, 깃헙을 지원합니다. 비밀번호 없이 바로 시작할 수 있어요.",
    },
    {
      question: "회원탈퇴는 어떻게 하나요?",
      answer:
        "대시보드 > 설정 페이지 하단의 '회원탈퇴' 섹션에서 탈퇴할 수 있어요. 탈퇴 시 개인 프로필 정보, 작성한 모든 게시글, 업로드한 미디어 파일, 연결된 SNS 계정 정보, 사용 통계 및 분석 데이터 등 모든 등록된 데이터가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없으니 신중하게 결정해주세요.",
    },
  ],
  service: [
    {
      question: "이 서비스는 어떤 기능을 제공하나요?",
      answer:
        "SNS(쓰레드, 인스타그램 등)에 올릴 짧은 글을 더 자연스럽고 감성적으로 작성할 수 있게 도와줘요. 주제, 분위기, 키워드만 입력하면, 마치 사람이 쓴 것 같은 글을 만들어줘요.",
    },
    {
      question: "글이 너무 AI 같다고 느껴질 땐 어떻게 하나요?",
      answer:
        "결과물이 기계적으로 느껴진다면, 피드백 기능을 통해 어조나 분위기를 조정할 수 있어요. 원하는 방향을 말하면 다시 생성해주거나, 자주 쓰는 말투를 기억해서 점점 더 나답게 다듬어줘요.",
    },
    {
      question: "최근 쓴 글을 기반으로 분석도 해주나요?",
      answer:
        "네! 최근 작성한 글들을 분석해서 자주 쓰는 단어, 분위기, 관심사를 파악해요. 그리고 오늘은 어떤 주제를 써보면 좋을지 자연스럽게 추천해줘요.",
    },
    {
      question: "문체나 말투는 어떻게 조절되나요?",
      answer:
        "기본은 '친근한 SNS 말투'지만, 감성적인 분위기, 유머러스한 톤, 신뢰감 있는 느낌 등 원하는 스타일을 선택할 수 있어요. ",
    },
    {
      question: "글 작성에 사용하는 정보는 어디까지 필요한가요?",
      answer:
        "핵심은 주제, 분위기, 키워드예요. 선택적으로 시점, 날씨, 길이 등을 입력하면 좀 더 정교한 결과를 받을 수 있어요.",
    },
    {
      question: "내가 자주 쓰는 말투도 반영되나요?",
      answer:
        "네. 자주 쓰는 표현이나 키워드, 선호하는 말투를 학습해 나만의 스타일이 반영된 글을 만들어줘요. 쓰면 쓸수록 나를 닮아가요.",
    },
    {
      question: "생성된 글은 수정이 가능한가요?",
      answer:
        "물론이죠. 일종의 '초안'을 먼저 받아보고, 마음에 들지 않으면 다시 생성하거나 직접 수정해도 돼요. 전체 글의 90%를 대신 써주는 느낌이에요.",
    },
  ],
  pricing: [
    {
      question: "요금제는 어떻게 되나요?",
      answer:
        "지금은 무료로 사용 가능하지만, 곧 유료 요금제가 도입될 예정이에요. 유료 플랜에서는 더 많은 기능(예: 글쓰기 분석 리포트, 말투 학습, 고급 템플릿 등)을 제공할 예정이에요.",
    },
  ],
  mobile: [
    {
      question: "어떤 플랫폼에서 사용할 수 있나요?",
      answer:
        "현재는 웹에서 사용 가능하고, 모바일 브라우저에서도 문제없이 작동해요. 전용 앱은 준비 중이며 곧 출시될 예정이에요.",
    },
  ],
};

export default function FAQ({}: Route.ComponentProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-4xl font-bold">📌 자주 묻는 질문 (FAQ)</h1>
        <p className="text-muted-foreground text-xl">
          Capsule 서비스에 대해 궁금한 점들을 확인해보세요
        </p>
      </div>

      {/* 회원 관련 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">회원 관련</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqData.signup.map((faq, index) => (
              <AccordionItem key={index} value={`signup-${index}`}>
                <AccordionTrigger className="text-left text-lg font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* 서비스 이용 관련 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">서비스 이용 관련</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqData.service.map((faq, index) => (
              <AccordionItem key={index} value={`service-${index}`}>
                <AccordionTrigger className="text-left text-lg font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* 요금제 관련 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">요금제 관련</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqData.pricing.map((faq, index) => (
              <AccordionItem key={index} value={`pricing-${index}`}>
                <AccordionTrigger className="text-left text-lg font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* 모바일 관련 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">모바일 관련</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqData.mobile.map((faq, index) => (
              <AccordionItem key={index} value={`mobile-${index}`}>
                <AccordionTrigger className="text-left text-lg font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
