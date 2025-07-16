import type { Route } from "./+types/private.layout";

import { useEffect } from "react";
import { Outlet, redirect } from "react-router";
import { useRouteLoaderData } from "react-router";

import makeServerClient from "../lib/supa-client.server";

export async function loader({ request }: Route.LoaderArgs) {
  const [client] = makeServerClient(request);
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) {
    throw redirect("/login");
  }

  return {};
}

export default function PrivateLayout() {
  return <Outlet />;
}
