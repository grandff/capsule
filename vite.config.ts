import { reactRouter } from "@react-router/dev/vite";
import {
  type SentryReactRouterBuildOptions,
  sentryReactRouter,
} from "@sentry/react-router";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";
import path from "path";
import { type PluginOption, defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig((config) => {
  const sentryConfig: SentryReactRouterBuildOptions = {
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    authToken: process.env.SENTRY_AUTH_TOKEN,
    telemetry: false, // Sentry telemetry 비활성화
  };
  let plugins: PluginOption[] = [tailwindcss(), reactRouter(), tsconfigPaths()];
  if (
    process.env.SENTRY_ORG &&
    process.env.SENTRY_PROJECT &&
    process.env.SENTRY_AUTH_TOKEN
  ) {
    plugins = [...plugins, sentryReactRouter(sentryConfig, config)];
  }

  // 로컬 개발 환경에서만 HTTPS 설정 적용
  const isLocalDev =
    process.env.NODE_ENV === "development" && !process.env.VERCEL;
  const httpsConfig = isLocalDev
    ? {
        key: fs.readFileSync(path.resolve(__dirname, "localhost+2-key.pem")),
        cert: fs.readFileSync(path.resolve(__dirname, "localhost+2.pem")),
      }
    : undefined;

  return {
    server: {
      allowedHosts: true,
      // thread api 연계를 위한 localhost https 설정 (로컬 개발 환경에서만)
      ...(httpsConfig && { https: httpsConfig }),
      watch: {
        ignored: [
          "**/*.spec.ts",
          "**/*.test.ts",
          "**/tests/**",
          "**/playwright-report/**",
          "**/test-results/**",
        ],
      },
    },
    build: {
      sourcemap: process.env.NODE_ENV === "development", // 개발 환경에서만 sourcemap 활성화
    },
    plugins,
    sentryConfig,
  };
});
