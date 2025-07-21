import type * as React from "react";

import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
  pixelBasedPreset,
} from "@react-email/components";

interface WelcomeUserEmailProps {
  steps: {
    id: number;
    Description: React.ReactNode;
  }[];
  links: {
    title: string;
    href: string;
  }[];
}

const baseUrl = "https://capsule-three.vercel.app";

export const WelcomeUserEmail = ({ steps, links }: WelcomeUserEmailProps) => {
  return (
    <Html>
      <Head />
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              colors: {
                brand: "#2250f4",
                offwhite: "#fafbfb",
              },
              spacing: {
                0: "0px",
                20: "20px",
                45: "45px",
              },
            },
          },
        }}
      >
        <Preview>단 3번의 클릭으로 끝내는 브랜드 홍보, Capsule</Preview>
        <Body className="bg-offwhite font-sans text-base">
          {/* FIXME 로고 생성 후 수정*/}
          <Img
            src={`${baseUrl}/static/netlify-logo.png`}
            width="184"
            height="75"
            alt="Netlify"
            className="mx-auto my-20"
          />
          <Container className="bg-white p-45">
            <Heading className="my-0 text-center leading-8">
              클릭만 하면 Capsule이 써드려요!
            </Heading>
            <Section className="mt-20">
              <Row>
                <Text className="text-base">
                  Capsule은 브랜드 홍보에 딱 맞는 콘텐츠를 단 3번의 클릭으로
                  완성해드려요. 내가 직접 쓴 것처럼 자연스럽고, SNS 반응도 좋은
                  글을 지금 바로 만들어보세요.
                </Text>

                <Text className="text-base">
                  글쓰기, 문체 고민, 콘텐츠 아이디어를 Capsule에 맡겨보세요.
                </Text>
              </Row>
            </Section>

            <ul>{steps?.map(({ Description }) => Description)}</ul>

            <Section className="text-center">
              <Button className="bg-brand rounded-lg px-[18px] py-3 text-white">
                5초 안에 홍보하러가기
              </Button>
            </Section>

            {/* <Section className="mt-45">
              <Row>
                {links?.map((link) => (
                  <Column key={link.title}>
                    <Link
                      className="font-bold text-black underline"
                      href={link.href}
                    >
                      {link.title}
                    </Link>{" "}
                    <span className="text-green-500">→</span>
                  </Column>
                ))}
              </Row>
            </Section> */}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

WelcomeUserEmail.PreviewProps = {
  steps: [
    {
      id: 1,
      Description: (
        <li className="mb-20" key={1}>
          <strong>Step 1.</strong> 오늘 다루고 싶은 주제를 간단히 입력하고,
          원하는 분위기를 선택하세요.
        </li>
      ),
    },
    {
      id: 2,
      Description: (
        <li className="mb-20" key={2}>
          <strong>Step 2.</strong> Capsule이 브랜드 스타일에 맞춰 고퀄리티 홍보
          글을 자동으로 만들어드립니다.
        </li>
      ),
    },
    {
      id: 3,
      Description: (
        <li className="mb-20" key={3}>
          <strong>Step 3.</strong> 완성된 글을 소셜 미디어에 바로 공유하고,
          반응을 확인해보세요.
        </li>
      ),
    },
  ],
  links: [
    {
      title: "Visit the forums",
      href: "https://www.netlify.com",
    },
    { title: "Read the docs", href: "https://www.netlify.com" },
    { title: "Contact an expert", href: "https://www.netlify.com" },
  ],
} satisfies WelcomeUserEmailProps;

export default WelcomeUserEmail;
