/**
 * Sentry Error Monitoring Debug Module
 *
 * This module provides a test page for verifying that the Sentry error monitoring integration
 * is working correctly. It allows developers and administrators to deliberately trigger a test
 * error and verify that it's being properly captured and reported to Sentry.
 *
 * The page includes:
 * - A simple UI with a button to trigger a test error
 * - An action function that throws an error when the form is submitted
 *
 * This is useful during development and after deployment to ensure that error monitoring
 * is functioning as expected without having to create actual error conditions in production code.
 * It helps verify the complete error reporting pipeline from client to Sentry dashboard.
 */
import type { Route } from "./+types/sentry";

import * as Sentry from "@sentry/react-router";
import { Form } from "react-router";

import { Button } from "~/core/components/ui/button";

/**
 * Meta function for setting page metadata
 *
 * This function sets the page title for the Sentry test page,
 * using the application name from environment variables.
 *
 * @returns Array of metadata objects for the page
 */
export const meta: Route.MetaFunction = () => {
  return [
    {
      title: `Sentry Test | ${import.meta.env.VITE_APP_NAME}`,
    },
  ];
};

// loader에서 운영환경인 경우에는 접근 불가하도록 error 처리
export async function loader({ request }: Route.LoaderArgs) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("This page is not available in production");
  }
  return {};
}

/**
 * Action function that deliberately throws an error
 *
 * This function is called when the form is submitted. It intentionally throws
 * an error with a descriptive message to test that Sentry is properly capturing
 * and reporting errors from server-side actions.
 *
 * The error should appear in the Sentry dashboard with the full stack trace and
 * any additional context that Sentry is configured to capture.
 *
 * @throws Error - A test error to be captured by Sentry
 */
export function action() {
  throw new Error("This is a test error, you should see it in Sentry");
}

/**
 * Sentry Test Component
 *
 * This component renders a simple interface for testing Sentry error monitoring integration.
 * It displays a button that triggers a test error when clicked by submitting a form that
 * calls the action function, which throws an error.
 *
 * The component uses React Router's Form component to handle the form submission.
 * When the button is clicked, the action function is called, an error is thrown,
 * and Sentry should capture and report it.
 *
 * @returns React component for testing Sentry error monitoring
 */
export default function TriggerError() {
  // 클라이언트 사이드 에러 핸들러
  const handleClientError = () => {
    throw new Error("This is a client-side test error for Sentry");
  };

  // Sentry에 직접 에러 캐치
  const handleSentryError = () => {
    Sentry.captureException(new Error("This is a Sentry captured error"));
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2 px-5 py-10 md:px-10 md:py-20">
      <h1 className="text-2xl font-semibold">Sentry Test</h1>
      <p className="text-muted-foreground text-center">
        Test that the Sentry integration is working by triggering an error
        clicking the button below.
      </p>

      <div className="mt-5 flex flex-col gap-4">
        {/* Form that calls the action function which throws an error */}
        <Form method="post" className="flex justify-center">
          <Button>Trigger Server Error (Action)</Button>
        </Form>

        {/* 클라이언트 사이드 에러 테스트 */}
        <div className="flex justify-center">
          <Button onClick={handleClientError} variant="outline">
            Trigger Client Error
          </Button>
        </div>

        {/* Sentry 직접 캐치 테스트 */}
        <div className="flex justify-center">
          <Button onClick={handleSentryError} variant="secondary">
            Trigger Sentry Capture
          </Button>
        </div>
      </div>
    </div>
  );
}
