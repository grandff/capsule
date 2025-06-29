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
  };
  let plugins: PluginOption[] = [tailwindcss(), reactRouter(), tsconfigPaths()];
  if (
    process.env.SENTRY_ORG &&
    process.env.SENTRY_PROJECT &&
    process.env.SENTRY_AUTH_TOKEN
  ) {
    plugins = [...plugins, sentryReactRouter(sentryConfig, config)];
  }
  return {
    server: {
      allowedHosts: true,
      // thread api 연계를 위한 localhost https 설정
      https: {
        key: fs.readFileSync(path.resolve(__dirname, "localhost+2-key.pem")),
        cert: fs.readFileSync(path.resolve(__dirname, "localhost+2.pem")),
      },
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
      sourcemap: Boolean(process.env.SENTRY_DSN),
    },
    plugins,
    sentryConfig,
  };
});
