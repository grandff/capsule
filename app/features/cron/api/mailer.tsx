/**
 * Email Queue Processing API Endpoint
 *
 * This file implements a cron-triggered API endpoint that processes emails from a Postgres
 * message queue (PGMQ). It's designed to be called by a scheduled job to handle
 * asynchronous email sending, improving performance and reliability by decoupling
 * email sending from user-facing operations.
 *
 * Key features:
 * - Secured with a CRON_SECRET for authentication
 * - Processes one email at a time from the queue
 * - Supports different email templates
 * - Integrates with Sentry for error tracking
 * - Uses Resend for email delivery
 */
import type { Route } from "./+types/mailer";

import * as Sentry from "@sentry/node";
import WelcomeUserEmail from "react-email-starter/emails/welcome-user";
import { data } from "react-router";

import resendClient from "~/core/lib/resend-client.server";
import adminClient from "~/core/lib/supa-admin-client.server";

/**
 * Interface representing an email message in the queue
 *
 * @property to - Recipient email address
 * @property data - Key-value pairs of dynamic content for the email template
 * @property template - Template identifier (e.g., "welcome") to determine which email to send
 */
interface EmailMessage {
  to: string;
  data: Record<string, string>;
  template: string;
}

/**
 * API endpoint action handler for processing the email queue
 *
 * This function is triggered by a cron job and processes one email from the queue at a time.
 * The workflow is:
 * 1. Authenticate the request using CRON_SECRET
 * 2. Pop a message from the PGMQ queue
 * 3. Process the message based on the template type
 * 4. Send the email using Resend
 * 5. Track any errors with Sentry
 *
 * Security considerations:
 * - Requires a valid CRON_SECRET for authentication
 * - Only accepts POST requests
 * - Uses admin client with elevated permissions (safely contained in this endpoint)
 *
 * @param request - The incoming HTTP request from the cron job
 * @returns A response with appropriate status code (200 for success, 401 for unauthorized)
 */

export async function loader({ request }: Route.LoaderArgs) {
  // 개발 환경을 제외하고는 접근불가 403
  if (process.env.NODE_ENV !== "development") {
    return data(null, { status: 403 });
  }
  // Pop a message from the Postgres message queue (PGMQ)
  // Note: Using admin client is necessary to access the queue
  const { data: message, error } = await adminClient
    // @ts-expect-error - PGMQ types are not fully defined in the Supabase client
    .schema("pgmq_public")
    .rpc("pop", {
      queue_name: "mailer", // Queue name in Postgres
    });

  // Log any errors that occur when accessing the queue
  if (error) {
    console.error("Error accessing the queue", error);
    Sentry.captureException(
      error instanceof Error ? error : new Error(String(error)),
    );
  }

  // Process the message if one was retrieved from the queue
  if (message.length > 0 && message[0]) {
    // Extract email details from the message
    const {
      message: { to, data: emailData, template },
    } = message[0] as { message: EmailMessage };

    // Process different email templates
    if (template === "welcome") {
      // Check if Resend client is available
      if (!resendClient) {
        console.error("Resend client is not configured");
        Sentry.captureException(new Error("Resend client is not configured"));
        return data(null, { status: 500 });
      }

      // Send welcome email using the Resend client
      const { error } = await resendClient.emails.send({
        // Make sure this domain is the Resend domain.
        from: "Capsule <admin@mail.capsule.diy>",
        to: [to],
        subject: "3번 클릭으로 끝내는 글쓰기, 시작해보세요!",
        react: WelcomeUserEmail(),
      });

      // Log any errors that occur during email sending
      if (error) {
        console.error("Error sending email", error);
        Sentry.captureException(
          error instanceof Error ? error : new Error(String(error)),
        );
      }
    }
    // Additional templates can be handled here with more if/else conditions
  }

  // Return success response
  // Note: We return 200 even if there were errors to prevent the cron job from failing
  // Errors are tracked in Sentry for monitoring and debugging
  return data(null, { status: 200 });
}

export async function action({ request }: Route.LoaderArgs) {
  // Security check: Verify this is a POST request with the correct secret
  if (
    request.method !== "POST" ||
    request.headers.get("Authorization") !== process.env.CRON_SECRET
  ) {
    console.error("Unauthorized request");
    return data(null, { status: 401 });
  }

  // Pop a message from the Postgres message queue (PGMQ)
  // Note: Using admin client is necessary to access the queue
  const { data: message, error } = await adminClient
    // @ts-expect-error - PGMQ types are not fully defined in the Supabase client
    .schema("pgmq_public")
    .rpc("pop", {
      queue_name: "mailer", // Queue name in Postgres
    });

  // Log any errors that occur when accessing the queue
  if (error) {
    console.error("Error accessing the queue", error);
    Sentry.captureException(
      error instanceof Error ? error : new Error(String(error)),
    );
  }

  console.error("message", message);

  // Process the message if one was retrieved from the queue
  if (message) {
    // Extract email details from the message
    console.error("message", message);
    const {
      message: { to, data: emailData, template },
    } = message as { message: EmailMessage };

    // Process different email templates
    if (template === "welcome") {
      // Check if Resend client is available
      if (!resendClient) {
        console.error("Resend client is not configured");
        Sentry.captureException(new Error("Resend client is not configured"));
        return data(null, { status: 500 });
      }

      // Send welcome email using the Resend client
      const { error } = await resendClient.emails.send({
        // Make sure this domain is the Resend domain.
        from: "CapsuleMaster <admin@mail.capsule.diy>",
        to: [to],
        subject: "3번 클릭으로 끝내는 글쓰기, 시작해보세요!",
        react: WelcomeUserEmail(),
      });

      // Log any errors that occur during email sending
      if (error) {
        console.error("Error sending email", error);
        Sentry.captureException(
          error instanceof Error ? error : new Error(String(error)),
        );
      }
    }
    // Additional templates can be handled here with more if/else conditions
  }

  // Return success response
  // Note: We return 200 even if there were errors to prevent the cron job from failing
  // Errors are tracked in Sentry for monitoring and debugging
  return data(null, { status: 200 });
}
