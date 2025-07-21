/**
 * Authentication and Request Guards Module
 *
 * This module provides utility functions for protecting routes and API endpoints
 * by enforcing authentication and HTTP method requirements. These guards are designed
 * to be used in React Router loaders and actions to ensure proper access control
 * and request validation.
 *
 * The module includes:
 * - Authentication guard to ensure a user is logged in
 * - HTTP method guard to ensure requests use the correct HTTP method
 * - App request detection to identify requests from mobile app
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import { data } from "react-router";

/**
 * Require user authentication for a route or action
 *
 * This function checks if a user is currently authenticated by querying the Supabase
 * client. If no user is found, it throws a 401 Unauthorized response, which will be
 * handled by React Router's error boundary system.
 *
 * @example
 * // In a loader or action function
 * export async function loader({ request }: LoaderArgs) {
 *   const [client] = makeServerClient(request);
 *   await requireAuthentication(client);
 *
 *   // Continue with authenticated logic...
 *   return json({ ... });
 * }
 *
 * @param client - The Supabase client instance to use for authentication check
 * @throws {Response} 401 Unauthorized if no user is authenticated
 */

const appRequestHeaders = ["X-App-Source", "User-Agent"];
const appRequestHeaderValues = [
  process.env.X_APP_SOURCE,
  process.env.APP_AGENT_VALUE,
];

export async function requireAuthentication(client: SupabaseClient) {
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) {
    throw data(null, { status: 401 });
  }
  return user;
}

/**
 * Require a specific HTTP method for a route action
 *
 * This function returns a middleware that checks if the incoming request uses
 * the specified HTTP method. If not, it throws a 405 Method Not Allowed response.
 * This is useful for ensuring that endpoints only accept the intended HTTP methods.
 *
 * @example
 * // In an action function
 * export async function action({ request }: ActionArgs) {
 *   requireMethod('POST')(request);
 *
 *   // Continue with POST-specific logic...
 *   return json({ ... });
 * }
 *
 * @param method - The required HTTP method (e.g., 'GET', 'POST', 'PUT', 'DELETE')
 * @returns A function that validates the request method
 * @throws {Response} 405 Method Not Allowed if the request uses an incorrect method
 */
export function requireMethod(method: string) {
  return (request: Request) => {
    if (request.method !== method) {
      throw data(null, { status: 405 });
    }
  };
}

/**
 * Check if the request is coming from the mobile app
 *
 * This function examines the request headers to determine if the request
 * is originating from the Capsule mobile app. It checks for the presence
 * of specific headers that are set by the mobile app.
 *
 * @example
 * // In a loader or action function
 * export async function loader({ request }: LoaderArgs) {
 *   const isAppRequest = detectAppRequest(request);
 *
 *   if (isAppRequest) {
 *     // Handle app-specific logic
 *     return handleAppRequest(request);
 *   }
 *
 *   // Handle web request
 *   return handleWebRequest(request);
 * }
 *
 * @param request - The incoming request object
 * @returns true if the request is from the mobile app, false otherwise
 */
export function detectAppRequest(request: Request): boolean {
  // Check for app-specific headers
  const hasAppSource = appRequestHeaders.some(
    (header) => request.headers.get(header) === appRequestHeaderValues[0],
  );
  const hasAppUserAgent = appRequestHeaders.some(
    (header) => request.headers.get(header) === appRequestHeaderValues[1],
  );

  return hasAppSource || hasAppUserAgent;
}

/**
 * Require app request for a route or action
 *
 * This function ensures that the request is coming from the mobile app.
 * If not, it throws a 403 Forbidden response.
 *
 * @example
 * // In a loader or action function
 * export async function action({ request }: ActionArgs) {
 *   requireAppRequest(request);
 *
 *   // Continue with app-specific logic...
 *   return json({ ... });
 * }
 *
 * @param request - The incoming request object
 * @throws {Response} 403 Forbidden if the request is not from the mobile app
 */
export function requireAppRequest(request: Request) {
  if (!detectAppRequest(request)) {
    throw data(null, { status: 403 });
  }
}

/**
 * Get app request metadata
 *
 * This function extracts and returns metadata about the app request,
 * including the app source and user agent information.
 *
 * @param request - The incoming request object
 * @returns Object containing app request metadata
 */
export function getAppRequestMetadata(request: Request) {
  const isAppRequest = detectAppRequest(request);
  const appSource = request.headers.get("X-App-Source");
  const userAgent = request.headers.get("User-Agent");

  return {
    isAppRequest,
    appSource,
    userAgent,
    // Extract app version if available in User-Agent
    appVersion: userAgent?.match(/CapsuleApp\/([^\/\s]+)/)?.[1] || null,
  };
}
