import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";

import { data } from "react-router";

import makeServerClient from "~/core/lib/supa-client.server";

import { fetchUserInsights } from "../utils/insights-utils";

export async function action({ request }: ActionFunctionArgs) {
  const [client, headers] = makeServerClient(request);
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const result = await fetchUserInsights(client, user.id);

  if (result.success) {
    return data(result);
  } else {
    return data(result, { status: 500 });
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  // action과 동일한 로직을 loader에서도 실행
  return action({ request } as ActionFunctionArgs);
}
