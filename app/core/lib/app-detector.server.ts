/**
 * App Request Detection Module
 *
 * This module provides utility functions to detect and handle requests
 * coming from the mobile app. It checks for specific headers that indicate
 * the request is from the Capsule mobile app.
 *
 * The module identifies app requests by checking:
 * - X-App-Source header with value 'capsule-app'
 * - User-Agent containing 'CapsuleApp/1.0'
 */

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

const appRequestHeaders = ["X-App-Source", "User-Agent"];
const appRequestHeaderValues = [
  process.env.X_APP_SOURCE,
  process.env.APP_AGENT_VALUE,
];

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
    throw new Response("App request required", { status: 403 });
  }
}

/**
 * Handle different request types (app vs web)
 *
 * This function provides a convenient way to handle different logic
 * based on whether the request is from the app or web.
 *
 * @example
 * // In a loader or action function
 * export async function loader({ request }: LoaderArgs) {
 *   return handleRequestType(request, {
 *     app: async () => {
 *       // App-specific logic
 *       return json({ data: 'app-data' });
 *     },
 *     web: async () => {
 *       // Web-specific logic
 *       return json({ data: 'web-data' });
 *     }
 *   });
 * }
 *
 * @param request - The incoming request object
 * @param handlers - Object containing app and web handler functions
 * @returns The result of the appropriate handler
 */
export async function handleRequestType<T>(
  request: Request,
  handlers: {
    app: () => Promise<T> | T;
    web: () => Promise<T> | T;
  },
): Promise<T> {
  const isAppRequest = detectAppRequest(request);

  if (isAppRequest) {
    return await handlers.app();
  } else {
    return await handlers.web();
  }
}
