import type { Route } from "./+types/dashboard.layout";

import { Outlet } from "react-router";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/core/components/ui/sidebar";
import { SettingsProvider } from "~/core/contexts/settings-context";
import { useIsMobile } from "~/core/hooks/use-mobile";
import makeServerClient from "~/core/lib/supa-client.server";

import DashboardSidebar from "../components/dashboard-sidebar";

export async function loader({ request }: Route.LoaderArgs) {
  const [client] = makeServerClient(request);
  const {
    data: { user },
  } = await client.auth.getUser();
  return {
    user,
  };
}

export default function DashboardLayout({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;
  const isMobile = useIsMobile();
  // 모바일 환경에서는 사이드바 미제공
  // TODO 모바일 웹에서는 앱화면으로 이동해야함
  return (
    <SettingsProvider>
      <SidebarProvider>
        <DashboardSidebar
          user={{
            name: user?.user_metadata.name ?? "",
            avatarUrl: user?.user_metadata.avatar_url ?? "",
            email: user?.email ?? "",
          }}
        />
        <SidebarInset>
          <header className="flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
            </div>
          </header>
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </SettingsProvider>
  );
}
