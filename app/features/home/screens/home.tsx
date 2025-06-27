/**
 * Home Page Component
 *
 * This file implements the main landing page of the application with internationalization support.
 * It demonstrates the use of i18next for multi-language content, React Router's data API for
 * server-side rendering, and responsive design with Tailwind CSS.
 *
 * Key features:
 * - Server-side translation with i18next
 * - Client-side translation with useTranslation hook
 * - SEO-friendly metadata using React Router's meta export
 * - Responsive typography with Tailwind CSS
 */
import type { Route } from "./+types/home";

import { Marquee } from "components/magicui/marquee";
import { SparklesText } from "components/magicui/sparkles-text";
import { Apple, Monitor, Smartphone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/core/components/ui/avatar";
import { Button } from "~/core/components/ui/button";
import { Card, CardContent } from "~/core/components/ui/card";
import i18next from "~/core/lib/i18next.server";

/**
 * Meta function for setting page metadata
 *
 * This function generates SEO-friendly metadata for the home page using data from the loader.
 * It sets:
 * - Page title from translated "home.title" key
 * - Meta description from translated "home.subtitle" key
 *
 * The metadata is language-specific based on the user's locale preference.
 *
 * @param data - Data returned from the loader function containing translated title and subtitle
 * @returns Array of metadata objects for the page
 */
export const meta: Route.MetaFunction = ({ data }) => {
  return [
    { title: data?.title },
    { name: "description", content: data?.subtitle },
  ];
};

/**
 * Loader function for server-side data fetching
 *
 * This function is executed on the server before rendering the component.
 * It:
 * 1. Extracts the user's locale from the request (via cookies or Accept-Language header)
 * 2. Creates a translation function for that specific locale
 * 3. Returns translated strings for the page title and subtitle
 *
 * This approach ensures that even on first load, users see content in their preferred language,
 * which improves both user experience and SEO (search engines see localized content).
 *
 * @param request - The incoming HTTP request containing locale information
 * @returns Object with translated title and subtitle strings
 */
export async function loader({ request }: Route.LoaderArgs) {
  // Get a translation function for the user's locale from the request
  const t = await i18next.getFixedT(request);

  // TODO 로그인 된 상태면 대시보드로 리다이렉트

  // Return translated strings for use in both the component and meta function
  return {
    title: t("home.title"),
    subtitle: t("home.subtitle"),
  };
}

/**
 * Home page component
 *
 * This is the main landing page component of the application. It displays a simple,
 * centered layout with a headline and subtitle, both internationalized using i18next.
 *
 * Features:
 * - Uses the useTranslation hook for client-side translation
 * - Implements responsive design with Tailwind CSS
 * - Maintains consistent translations between server and client
 *
 * The component is intentionally simple to serve as a starting point for customization.
 * It demonstrates the core patterns used throughout the application:
 * - Internationalization
 * - Responsive design
 * - Clean, semantic HTML structure
 *
 * @returns JSX element representing the home page
 */
export default function Home() {
  // Get the translation function for the current locale
  const { t } = useTranslation();
  const { isLoggedIn } = useOutletContext<{ isLoggedIn: boolean }>();
  const navigate = useNavigate();

  // 애니메이션을 위한 상태와 ref
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set(),
  );
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // 스크롤 감지 및 애니메이션 처리
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1 },
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // 사용자 후기 데이터
  const reviews = [
    {
      id: 1,
      name: "김민수",
      avatar: "/nft.jpg",
      content:
        "AI가 작성한 홍보글이 정말 효과적이에요! 팔로워 증가율이 3배나 올랐습니다.",
    },
    {
      id: 2,
      name: "이지영",
      avatar: "/nft-2.jpg",
      content:
        "간단한 선택만으로 고품질 홍보글이 자동으로 업로드되어 너무 편해요.",
    },
    {
      id: 3,
      name: "박준호",
      avatar: "/nft.jpg",
      content:
        "브랜드 홍보가 이렇게 쉬울 수 있구나! AI가 트렌드를 반영해서 글을 써줘서 인기가 많아졌어요.",
    },
    {
      id: 4,
      name: "최수진",
      avatar: "/nft-2.jpg",
      content:
        "스레드, X 등 여러 플랫폼에 한 번에 업로드되어 시간이 정말 절약됩니다.",
    },
  ];

  // 서비스 특징 데이터
  const features = [
    {
      icon: "🤖",
      title: "AI 홍보글 생성",
      description:
        "간단한 선택만으로 브랜드에 최적화된 고품질 홍보글을 자동 생성합니다",
    },
    {
      icon: "📱",
      title: "자동 업로드",
      description: "스레드, X 등 연결된 SNS 플랫폼에 자동으로 업로드됩니다",
    },
    {
      icon: "🎯",
      title: "브랜드 최적화",
      description:
        "AI가 브랜드 특성과 트렌드를 분석하여 최적의 홍보 전략을 제시합니다",
    },
    {
      icon: "⚡",
      title: "5초 작성",
      description: "복잡한 글쓰기 없이 선택만으로 5초 안에 홍보글 완성",
    },
    {
      icon: "📊",
      title: "성과 분석",
      description:
        "업로드된 글의 반응과 브랜드 홍보 효과를 실시간으로 분석합니다",
    },
    {
      icon: "🔄",
      title: "멀티 플랫폼",
      description:
        "여러 SNS 플랫폼을 동시에 관리하고 일관된 브랜드 메시지를 전달합니다",
    },
  ];

  // 사용 방법 데이터
  const howToUse = [
    {
      title: "SNS 플랫폼 연결",
      description:
        "스레드, X 등 홍보하고 싶은 SNS 플랫폼을 연결하세요. 한 번 연결하면 계속 사용할 수 있습니다.",
      image: "/nft.jpg",
    },
    {
      title: "브랜드 정보 입력",
      description:
        "홍보하고 싶은 브랜드나 서비스의 특징, 타겟 고객, 핵심 메시지를 간단히 입력하세요.",
      image: "/nft-2.jpg",
    },
    {
      title: "홍보글 생성",
      description:
        "원하는 분위기와 키워드를 선택하면 AI가 브랜드에 최적화된 고품질 홍보글을 자동으로 생성합니다.",
      image: "/nft.jpg",
    },
    {
      title: "자동 업로드",
      description:
        "생성된 홍보글이 연결된 SNS 플랫폼에 자동으로 업로드되어 브랜드 홍보가 시작됩니다.",
      image: "/nft-2.jpg",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center gap-2.5">
      {/* Main headline with responsive typography */}
      <SparklesText>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl">
          {t("home.title")}
        </h1>
      </SparklesText>

      {/* Subtitle */}
      <h2 className="mt-5 text-2xl">{t("home.subtitle")}</h2>

      {/* 시작 버튼 */}
      <Button
        className="mt-10"
        onClick={() => {
          // 만약 로그인이 안되어 있으면 로그인화면으로 이동
          if (!isLoggedIn) {
            navigate("/login");
          } else {
            navigate("/dashboard");
          }
        }}
      >
        5초 안에 홍보하기
      </Button>

      {/* 플랫폼 지원 문구 */}
      <div className="mt-6 flex items-center gap-2 text-gray-600">
        <span className="text-sm">Capsule은</span>
        <div className="flex items-center gap-1">
          <Monitor className="h-4 w-4" />
          <span className="text-sm">PC</span>
        </div>
        <span className="text-sm">,</span>
        <div className="flex items-center gap-1">
          <Smartphone className="h-4 w-4" />
          <span className="text-sm">Android</span>
        </div>
        <span className="text-sm">,</span>
        <div className="flex items-center gap-1">
          <Apple className="h-4 w-4" />
          <span className="text-sm">iOS</span>
        </div>
        <span className="text-sm">를 모두 지원합니다</span>
      </div>

      {/* 1. 동영상 영역 */}
      <div
        id="video-section"
        ref={(el) => {
          sectionRefs.current["video-section"] = el;
        }}
        className={`mt-20 w-full max-w-4xl rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 p-8 transition-all duration-1000 ${
          visibleSections.has("video-section")
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
          AI 홍보글 생성 과정
        </h2>
        <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-gradient-to-br from-gray-200 to-gray-300">
          <div className="text-center">
            <div className="mb-4 text-6xl">🎥</div>
            <p className="text-lg text-gray-600">
              AI 홍보글 생성 및 자동 업로드 과정
            </p>
          </div>
        </div>
      </div>

      {/* 2. 사용자 후기 영역 */}
      <div
        id="reviews-section"
        ref={(el) => {
          sectionRefs.current["reviews-section"] = el;
        }}
        className={`mt-20 w-full max-w-6xl transition-all duration-1000 ${
          visibleSections.has("reviews-section")
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
          사용자 후기
        </h2>
        <div className="space-y-6">
          {/* 첫 번째 줄 - 왼쪽으로 이동 */}
          <Marquee className="py-4" pauseOnHover>
            {reviews.slice(0, 2).map((review) => (
              <Card
                key={review.id}
                className="mx-2 max-w-[160px] min-w-[160px] flex-shrink-0 border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <CardContent className="p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={review.avatar} />
                      <AvatarFallback className="bg-gray-100 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                        {review.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-xs font-semibold text-gray-900 dark:text-white">
                        {review.name}
                      </h3>
                    </div>
                  </div>
                  <p
                    className="overflow-hidden text-xs leading-relaxed text-gray-600 dark:text-gray-400"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: "vertical",
                      wordBreak: "break-word",
                    }}
                  >
                    {review.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </Marquee>

          {/* 두 번째 줄 - 오른쪽으로 이동 */}
          <Marquee className="py-4" pauseOnHover reverse>
            {reviews.slice(2, 4).map((review) => (
              <Card
                key={review.id}
                className="mx-2 max-w-[160px] min-w-[160px] flex-shrink-0 border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <CardContent className="p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={review.avatar} />
                      <AvatarFallback className="bg-gray-100 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                        {review.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-xs font-semibold text-gray-900 dark:text-white">
                        {review.name}
                      </h3>
                    </div>
                  </div>
                  <p
                    className="overflow-hidden text-xs leading-relaxed text-gray-600 dark:text-gray-400"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: "vertical",
                      wordBreak: "break-word",
                    }}
                  >
                    {review.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </Marquee>
        </div>
      </div>

      {/* 3. 사용 방법 소개 영역 */}
      <div
        id="how-to-section"
        ref={(el) => {
          sectionRefs.current["how-to-section"] = el;
        }}
        className={`mt-20 w-full max-w-6xl transition-all duration-1000 ${
          visibleSections.has("how-to-section")
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        <h2 className="mb-12 text-center text-3xl font-bold">사용 방법</h2>
        <div className="space-y-16">
          {howToUse.map((item, index) => (
            <div
              key={index}
              className={`flex items-center gap-12 ${
                index % 2 === 1 ? "flex-row-reverse" : ""
              }`}
            >
              <div className="flex-1">
                <h3 className="mb-4 text-2xl font-bold">{item.title}</h3>
                <p className="text-lg leading-relaxed text-gray-600">
                  {item.description}
                </p>
              </div>
              <div className="flex-1">
                <div className="flex aspect-video items-center justify-center rounded-xl bg-gradient-to-br from-gray-200 to-gray-300">
                  <div className="text-center">
                    <div className="mb-2 text-4xl">📱</div>
                    <p className="text-sm text-gray-600">화면 캡처</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. 서비스 특징 영역 */}
      <div
        id="features-section"
        ref={(el) => {
          sectionRefs.current["features-section"] = el;
        }}
        className={`mt-20 w-full max-w-6xl transition-all duration-1000 ${
          visibleSections.has("features-section")
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        <h2 className="mb-12 text-center text-3xl font-bold">서비스 특징</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 text-center transition-shadow hover:shadow-lg"
            >
              <CardContent className="p-4">
                <div className="mb-4 text-4xl">{feature.icon}</div>
                <h3 className="mb-3 text-xl font-semibold">{feature.title}</h3>
                <p className="leading-relaxed text-gray-600">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 앱스토어 다운로드 영역 */}
      <div
        id="download-section"
        ref={(el) => {
          sectionRefs.current["download-section"] = el;
        }}
        className={`mt-20 w-full max-w-4xl transition-all duration-1000 ${
          visibleSections.has("download-section")
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        <h2 className="mb-8 text-center text-3xl font-bold">앱 다운로드</h2>
        <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
          <a
            href="https://play.google.com/store/apps/details?id=com.capsule.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg bg-black px-6 py-3 text-white transition-colors hover:bg-gray-800"
          >
            <Smartphone className="h-6 w-6" />
            <div className="text-left">
              <div className="text-xs">GET IT ON</div>
              <div className="text-sm font-semibold">Google Play</div>
            </div>
          </a>

          <a
            href="https://apps.apple.com/app/capsule/id123456789"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg bg-black px-6 py-3 text-white transition-colors hover:bg-gray-800"
          >
            <Apple className="h-6 w-6" />
            <div className="text-left">
              <div className="text-xs">Download on the</div>
              <div className="text-sm font-semibold">App Store</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
