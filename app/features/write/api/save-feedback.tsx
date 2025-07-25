import { type ActionFunctionArgs, data } from "react-router";

import makeServerClient from "~/core/lib/supa-client.server";

import { saveFeedback } from "../mutations";

export async function action({ request }: ActionFunctionArgs) {
  // POST 요청만 허용
  if (request.method !== "POST") {
    return data({ error: "Method not allowed" }, { status: 405 });
  }

  const [client, headers] = makeServerClient(request);
  const formData = await request.formData();
  const originalText = formData.get("originalText");
  const feedbackText = formData.get("feedbackText");
  const etcText = formData.get("etcText");
  const isApplied = formData.get("isApplied");
  const profileId = formData.get("profileId");

  if (!originalText || !feedbackText) {
    return data({ error: "Missing required fields" }, { status: 400 });
  }

  await saveFeedback(client, {
    profile_id: profileId as string,
    original_text: originalText as string,
    feedback_text: feedbackText as string,
    etc_text: etcText as string,
    is_applied: isApplied === "true",
  });

  return data({ message: "Feedback saved successfully" }, { status: 200 });
}
