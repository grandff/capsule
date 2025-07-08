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
      title: "내가 홍보하고 싶은 SNS에 연결해보세요",
      description: "Thread, X 등 홍보하고 싶은 SNS를 연결하면,",
      description2: "Capsule에서 자동으로 업로드해드려요.",
      image: "/nft.jpg",
    },
    {
      title: "나만의 스타일을 선택해보세요",
      description: "분위기, 톤 등 나만의 스타일을 선택하면,",
      description2: "Casuple이 매력적인 카피라이터가 되어드려요.",
      image: "/nft-2.jpg",
    },
    {
      title: "모바일과 PC, 어디서나 사용해 보세요",
      description: "환경과 장소에 구애받지 않고,",
      description2: "어디서나 사용해 보세요.",
      image: "/nft.jpg",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center gap-2.5">
      {/* Main headline with responsive typography */}

      <span>
        <h1 className="justify-center text-4xl font-extrabold tracking-tight lg:text-6xl">
          브랜드 홍보, 어렵고 귀찮았죠?
        </h1>
        <h1 className="flex justify-center text-4xl font-extrabold tracking-tight lg:text-6xl">
          <SparklesText className="inline-block">Capsule</SparklesText>이 대신
          써줄게요.
        </h1>
      </span>

      {/* Subtitle */}
      <h2 className="mt-5 text-2xl text-gray-500 dark:text-gray-300">
        3번의 클릭이면, 글쓰기부터 업로드까지 끝!
      </h2>

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
      <div className="mt-6 flex flex-col items-center gap-2 text-gray-600 md:flex-row md:gap-2">
        <span className="text-sm">Capsule은</span>
        <div className="flex items-center gap-1">
          <Monitor className="h-4 w-4" />
          <span className="text-sm">PC</span>
          <span className="text-sm">,</span>
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="100"
            height="100"
            viewBox="0 0 48 48"
          >
            <path
              fill="#30dc80"
              d="M24,14.088C11.427,14.088,1.108,23.716,0,36h48C46.892,23.716,36.573,14.088,24,14.088z M33.179,27.079c0-1.104,0.895-1.999,1.999-1.999c1.104,0,1.999,0.895,1.999,1.999c0,1.104-0.895,1.999-1.999,1.999	C34.074,29.078,33.179,28.183,33.179,27.079z M12.822,29.078c-1.104,0-1.999-0.895-1.999-1.999c0-1.104,0.895-1.999,1.999-1.999	s1.999,0.895,1.999,1.999C14.821,28.183,13.926,29.078,12.822,29.078z"
            ></path>
            <path
              fill="#30dc80"
              d="M34.038,19.313c-0.14,0-0.281-0.035-0.41-0.11c-0.393-0.227-0.527-0.729-0.301-1.122l5.197-9.008	c0.227-0.394,0.729-0.529,1.122-0.301c0.393,0.227,0.527,0.729,0.301,1.122l-5.197,9.008C34.598,19.166,34.322,19.313,34.038,19.313	z"
            ></path>
            <path
              fill="#30dc80"
              d="M13.962,19.313c-0.284,0-0.56-0.148-0.712-0.411L8.054,9.894C7.827,9.501,7.962,8.999,8.354,8.772	c0.392-0.228,0.895-0.093,1.122,0.301l5.197,9.008c0.227,0.394,0.092,0.896-0.301,1.122C14.243,19.278,14.102,19.313,13.962,19.313z"
            ></path>
          </svg>
          <span className="text-sm">Android</span>
          <span className="text-sm">,</span>
          <svg
            className="hidden h-4 w-4 dark:block"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="250"
            height="250"
            viewBox="0,0,256,256"
          >
            <g
              fill="#ffffff"
              fill-rule="nonzero"
              stroke="none"
              stroke-width="1"
              stroke-linecap="butt"
              stroke-linejoin="miter"
              stroke-miterlimit="10"
              stroke-dasharray=""
              stroke-dashoffset="0"
              font-family="none"
              font-weight="none"
              font-size="none"
              text-anchor="none"
              style={{ mixBlendMode: "normal" }}
            >
              <g transform="scale(5.12,5.12)">
                <path d="M44.52734,34.75c-1.07812,2.39453 -1.59766,3.46484 -2.98437,5.57813c-1.94141,2.95313 -4.67969,6.64063 -8.0625,6.66406c-3.01172,0.02734 -3.78906,-1.96484 -7.87891,-1.92969c-4.08594,0.01953 -4.9375,1.96875 -7.95312,1.9375c-3.38672,-0.03125 -5.97656,-3.35156 -7.91797,-6.30078c-5.42969,-8.26953 -6.00391,-17.96484 -2.64844,-23.12109c2.375,-3.65625 6.12891,-5.80469 9.65625,-5.80469c3.59375,0 5.85156,1.97266 8.82031,1.97266c2.88281,0 4.63672,-1.97656 8.79297,-1.97656c3.14063,0 6.46094,1.71094 8.83594,4.66406c-7.76562,4.25781 -6.50391,15.34766 1.33984,18.31641zM31.19531,8.46875c1.51172,-1.94141 2.66016,-4.67969 2.24219,-7.46875c-2.46484,0.16797 -5.34766,1.74219 -7.03125,3.78125c-1.52734,1.85938 -2.79297,4.61719 -2.30078,7.28516c2.69141,0.08594 5.47656,-1.51953 7.08984,-3.59766z"></path>
              </g>
            </g>
          </svg>
          <svg
            className="h-4 w-4 dark:hidden"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="250"
            height="250"
            viewBox="0 0 50 50"
          >
            <path d="M 44.527344 34.75 C 43.449219 37.144531 42.929688 38.214844 41.542969 40.328125 C 39.601563 43.28125 36.863281 46.96875 33.480469 46.992188 C 30.46875 47.019531 29.691406 45.027344 25.601563 45.0625 C 21.515625 45.082031 20.664063 47.03125 17.648438 47 C 14.261719 46.96875 11.671875 43.648438 9.730469 40.699219 C 4.300781 32.429688 3.726563 22.734375 7.082031 17.578125 C 9.457031 13.921875 13.210938 11.773438 16.738281 11.773438 C 20.332031 11.773438 22.589844 13.746094 25.558594 13.746094 C 28.441406 13.746094 30.195313 11.769531 34.351563 11.769531 C 37.492188 11.769531 40.8125 13.480469 43.1875 16.433594 C 35.421875 20.691406 36.683594 31.78125 44.527344 34.75 Z M 31.195313 8.46875 C 32.707031 6.527344 33.855469 3.789063 33.4375 1 C 30.972656 1.167969 28.089844 2.742188 26.40625 4.78125 C 24.878906 6.640625 23.613281 9.398438 24.105469 12.066406 C 26.796875 12.152344 29.582031 10.546875 31.195313 8.46875 Z"></path>
          </svg>
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
        className={`mt-40 w-full max-w-6xl transition-all duration-1000 ${
          visibleSections.has("reviews-section")
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
          고민하지 말고 Capsule로 홍보하세요!
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
        className={`mt-40 w-full max-w-6xl transition-all duration-1000 ${
          visibleSections.has("how-to-section")
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        <h2 className="mb-12 text-center text-3xl font-bold">
          복잡한 광고, 이제는 쉽게 해결해드릴게요.
        </h2>
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
                <p className="text-grey-600 text-lg leading-relaxed dark:text-gray-400">
                  {item.description}
                </p>
                <p className="text-grey-600 text-lg leading-relaxed dark:text-gray-400">
                  {item.description2}
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
        className={`mt-40 w-full max-w-6xl transition-all duration-1000 ${
          visibleSections.has("features-section")
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        <h2 className="mb-12 text-center text-3xl font-bold">
          누구나 쉽게 시작할 수 있는 Capsule의 서비스
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 text-center transition-shadow hover:shadow-lg"
            >
              <CardContent className="p-4">
                <div className="mb-4 text-4xl">{feature.icon}</div>
                <h3 className="mb-3 text-xl font-semibold">{feature.title}</h3>
                <p className="leading-relaxed text-gray-600 dark:text-gray-400">
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
