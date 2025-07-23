import type { Config } from "@react-router/dev/config";

import { sentryOnBuildEnd } from "@sentry/react-router";
import { vercelPreset } from "@vercel/react-router/vite";
import { readdir } from "node:fs/promises";
import path from "node:path";

declare module "react-router" {
  interface Future {
    unstable_middleware: true;
  }
}

// const urls = (
//   await readdir(path.join(process.cwd(), "app", "features", "blog", "docs"))
// )
//   .filter((file) => file.endsWith(".mdx"))
//   .map((file) => `/blog/${file.replace(".mdx", "")}`);

export default {
  ssr: true,
  async prerender() {
    return [
      "/legal/terms-of-service",
      "/legal/privacy-policy",
      //"/blog",
      "/sitemap.xml",
      "/robots.txt",
      //...urls,
      // "/",
      // "/dashboard/write/today",
      // "/dashboard",

      // 기타 정적 페이지들
      "/faq",
    ];
  },
  presets: [
    ...(process.env.VERCEL_ENV === "production" ? [vercelPreset()] : []),
  ],
  buildEnd: async ({ viteConfig, reactRouterConfig, buildManifest }) => {
    console.log("buildEnd");
    if (
      process.env.SENTRY_ORG &&
      process.env.SENTRY_PROJECT &&
      process.env.SENTRY_AUTH_TOKEN
    ) {
      console.log("sentryOnBuildEnd");
      await sentryOnBuildEnd({
        viteConfig,
        reactRouterConfig,
        buildManifest,
      });
    }
  },
} satisfies Config;
