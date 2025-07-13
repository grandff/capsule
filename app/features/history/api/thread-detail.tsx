import type { LoaderFunctionArgs } from "react-router";

import { requireAuthentication } from "~/core/lib/guards.server";
import makeServerClient from "~/core/lib/supa-client.server";

import { getThreadDetail } from "../queries";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const [client, headers] = makeServerClient(request);
  await requireAuthentication(client);

  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const threadId = params.id;
  if (!threadId) {
    throw new Response("Thread ID is required", { status: 400 });
  }

  try {
    const thread = await getThreadDetail(client, user.id, parseInt(threadId));

    return new Response(JSON.stringify(thread), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...Object.fromEntries(headers.entries()),
      },
    });
  } catch (error) {
    console.error("Error loading thread detail:", error);
    throw new Response("Thread not found", { status: 404 });
  }
}
