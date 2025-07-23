import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

const baseUrl = "https://capsule.diy";

export const WelcomeUserEmail = () => {
  return (
    <Html>
      <Head />
      <Tailwind
        config={{
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
          <Img
            src={`${baseUrl}/logos/logo_light.png`}
            // src={`https://localhost:5173/logos/logo_light.png`}
            height="60"
            alt="Capsule"
            className="mx-auto my-20"
          />
          <Container className="bg-white p-45">
            <Heading className="my-0 text-center leading-8">
              클릭만 하면 Capsule이 써드려요!
            </Heading>
            <Section className="mt-20">
              <Row>
                <Text className="text-base">
                  Capsule은 단순한 글 작성 툴이 아닙니다. 시간은 없고, 무엇을
                  어떻게 써야 할지 막막할 때, 3번의 클릭으로 콘텐츠 제작을 끝낼
                  수 있도록 도와드려요.
                </Text>

                <Text className="text-base">
                  원하는 분위기(친근한, 전문적인 등)에 맞춰 문체를 조정할 수
                  있어 내가 직접 쓴 것처럼 자연스러운 글이 완성됩니다.
                </Text>

                <Text className="text-base">
                  글쓰기, 문체 고민, 콘텐츠 아이디어를 Capsule에 맡겨보세요.
                </Text>
              </Row>
            </Section>

            <ul>
              <li className="mb-20" key={1}>
                <strong>Step 1.</strong> 오늘 다루고 싶은 주제를 간단히
                입력하고, 원하는 분위기를 선택하세요.
              </li>
              <li className="mb-20" key={2}>
                <strong>Step 2.</strong> Capsule이 브랜드 스타일에 맞춰 고퀄리티
                홍보 글을 자동으로 만들어드립니다.
              </li>
              <li className="mb-20" key={3}>
                <strong>Step 3.</strong> 완성된 글을 소셜 미디어에 바로
                공유하고, 반응을 확인해보세요.
              </li>
            </ul>

            <Section className="text-center">
              <Button className="bg-brand rounded-lg px-[18px] py-3 text-white">
                지금 글 써보기
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

export default WelcomeUserEmail;
