/**
 * Application Routes Configuration
 *
 * This file defines all routes for the application using React Router's
 * file-based routing system. Routes are organized by feature and access level.
 *
 * The structure uses layouts for shared UI elements and prefixes for route grouping.
 * This approach creates a hierarchical routing system that's both maintainable and scalable.
 */
import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  route("/robots.txt", "core/screens/robots.ts"),
  route("/sitemap.xml", "core/screens/sitemap.ts"),
  ...prefix("/debug", [
    // You should delete this in production.
    route("/sentry", "debug/sentry.tsx"),
    route("/analytics", "debug/analytics.tsx"),
  ]),
  // API Routes. Routes that export actions and loaders but no UI.
  ...prefix("/api", [
    ...prefix("/settings", [
      route("/theme", "features/settings/api/set-theme.tsx"),
      route("/locale", "features/settings/api/set-locale.tsx"),
      ...prefix("/threads-auth", [
        index("features/settings/api/threads-auth.tsx"),
        route("/callback", "features/settings/api/threads-callback.tsx"),
      ]),
      route("/disconnect", "features/settings/api/disconnect.tsx"),
      route("/setting", "features/settings/api/setting.tsx"),
    ]),
    ...prefix("/users", [
      index("features/users/api/delete-account.tsx"),
      route("/password", "features/users/api/change-password.tsx"),
      route("/email", "features/users/api/change-email.tsx"),
      route("/profile", "features/users/api/edit-profile.tsx"),
      route("/providers", "features/users/api/connect-provider.tsx"),
      route("/insights", "features/users/api/get-user-insights.tsx"),
      route(
        "/providers/:provider",
        "features/users/api/disconnect-provider.tsx",
      ),
    ]),
    ...prefix("/write", [
      route("/send-to-thread", "features/write/api/send-to-thread.tsx"),
      route("/prompts", "features/write/api/prompts.tsx"),
      route("/upload-media", "features/write/api/upload-media.tsx"),
      route("/check-token", "features/write/api/check-token.tsx"),
    ]),
    ...prefix("/history", [
      route("/thread/:id", "features/history/api/thread-detail.tsx"),
      route(
        "/retrieve-user-posts/:id",
        "features/history/api/retrieve-user-posts.tsx",
      ),
      route(
        "/get-threads-replies/:id",
        "features/history/api/get-threads-replies.tsx",
      ),
      route(
        "/get-threads-conversations/:id",
        "features/history/api/get-threads-conversations.tsx",
      ),
      route("/get-insights", "features/history/api/get-insights.tsx"),
      route("/update-insights", "features/history/api/update-insights.tsx"),
    ]),
    ...prefix("/chatgpt", [
      route("/create-gpt-idea", "features/chatgpt/api/create-gpt-idea.tsx"),
    ]),
    ...prefix("/cron", [route("/mailer", "features/cron/api/mailer.tsx")]),
    ...prefix("/blog", [route("/og", "features/blog/api/og.tsx")]),
  ]),

  layout("core/layouts/navigation.layout.tsx", [
    route("/auth/confirm", "features/auth/screens/confirm.tsx"),
    index("features/home/screens/home.tsx"),
    route("/error", "core/screens/error.tsx"),
    layout("core/layouts/public.layout.tsx", [
      // Routes that should only be visible to unauthenticated users.
      route("/login", "features/auth/screens/login.tsx"),
      route("/join", "features/auth/screens/join.tsx"),
      ...prefix("/auth", [
        route("/api/resend", "features/auth/api/resend.tsx"),
        route(
          "/forgot-password/reset",
          "features/auth/screens/forgot-password.tsx",
        ),
        route("/magic-link", "features/auth/screens/magic-link.tsx"),
        ...prefix("/otp", [
          route("/start", "features/auth/screens/otp/start.tsx"),
          route("/complete", "features/auth/screens/otp/complete.tsx"),
        ]),
        ...prefix("/social", [
          route("/start/:provider", "features/auth/screens/social/start.tsx"),
          route(
            "/complete/:provider",
            "features/auth/screens/social/complete.tsx",
          ),
        ]),
      ]),
    ]),
    layout("core/layouts/private.layout.tsx", { id: "private-auth" }, [
      ...prefix("/auth", [
        route(
          "/forgot-password/create",
          "features/auth/screens/new-password.tsx",
        ),
        route("/email-verified", "features/auth/screens/email-verified.tsx"),
      ]),
      // Routes that should only be visible to authenticated users.
      route("/logout", "features/auth/screens/logout.tsx"),
    ]),
    route("/contact", "features/contact/screens/contact-us.tsx"),
  ]),

  layout("core/layouts/private.layout.tsx", { id: "private-dashboard" }, [
    layout("features/users/layouts/dashboard.layout.tsx", [
      ...prefix("/dashboard", [
        index("features/users/screens/dashboard.tsx"),
        route("/payments", "features/payments/screens/payments.tsx"),
        route("/write/today", "features/write/screens/write-today.tsx"),
        route("/write/result", "features/write/screens/write-result.tsx"),
        route("/history", "features/history/screens/history-list.tsx"),
        route("/history/:id", "features/history/screens/history-detail.tsx"),
        route("/trend", "features/trend/screens/trend-list.tsx"),
        route("/trend/user", "features/trend/screens/trend-user.tsx"),
        route("/trend/topic", "features/trend/screens/trend-topic.tsx"),
        route("/challenge", "features/challenge/screens/challenge-list.tsx"),
        route("/challenge/my", "features/challenge/screens/challenge-my.tsx"),
        route(
          "/challenge/:id",
          "features/challenge/screens/challenge-detail.tsx",
        ),
        route("/sns/connect", "features/settings/screens/sns-connect.tsx"),
        route("/premium", "features/settings/screens/premium.tsx"),
        route("/setting", "features/settings/screens/setting.tsx"),
      ]),
      route("/account/edit", "features/users/screens/account.tsx"),
    ]),
  ]),

  ...prefix("/legal", [route("/:slug", "features/legal/screens/policy.tsx")]),
] satisfies RouteConfig;
