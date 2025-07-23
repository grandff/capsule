import { nodeProfilingIntegration } from "@sentry/profiling-node";
import * as Sentry from "@sentry/react-router";

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      nodeProfilingIntegration(),
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
    tracePropagationTargets: [
      "localhost",
      /^https:\/\/capsule\.diy\/$/,
      /^https:\/\/capsule\.diy\/api\//,
    ],
  });
}
