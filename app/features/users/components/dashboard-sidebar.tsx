import { t } from "i18next";
import {
  HeartHandshakeIcon,
  MedalIcon,
  MegaphoneIcon,
  NotebookPen,
  Settings2Icon,
  Target,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "~/core/components/ui/sidebar";

import SidebarMain from "./sidebar-main";
import SidebarUser from "./sidebar-user";

const data = {
  navMain: [
    {
      title: "오늘의 브랜딩",
      url: "#",
      icon: NotebookPen,
      isActive: true,
      items: [
        {
          title: "새로운 글",
          url: "/dashboard/write/today",
        },
        {
          title: "작성한 글 목록",
          url: "/dashboard/history",
        },
      ],
    },
    {
      title: "트렌드",
      url: "#",
      icon: TrendingUp,
      items: [
        {
          title: "트렌드 분석",
          url: "/dashboard/trend",
        },
      ],
    },
    {
      title: "챌린지",
      url: "#",
      icon: MedalIcon,
      disabled: true,
      comingSoon: true,
      items: [
        {
          title: "진행 중인 챌린지",
          url: "#",
          disabled: true,
        },
        {
          title: "내 챌린지",
          url: "#",
          disabled: true,
        },
      ],
    },
    {
      title: "설정",
      url: "#",
      icon: Settings2Icon,
      items: [
        {
          title: "SNS 연결하기",
          url: "/dashboard/sns/connect",
        },
        {
          title: "요금제 관리",
          url: "#",
          disabled: true,
          comingSoon: true,
        },
        {
          title: "설정",
          url: "/dashboard/setting",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Sales Team",
      url: "#",
      icon: Target,
    },
    {
      name: "Customer Success",
      url: "#",
      icon: HeartHandshakeIcon,
    },
    {
      name: "Marketing",
      url: "#",
      icon: MegaphoneIcon,
    },
  ],
};

export default function DashboardSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: {
    name: string;
    email: string;
    avatarUrl: string;
  };
}) {
  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <Link to="/dashboard">
          <img
            src="/logos/logo_light.png"
            alt="Capsule"
            className="block h-8 w-auto dark:hidden"
          />
          <img
            src="/logos/logo_dark.png"
            alt="Capsule"
            className="hidden h-8 w-auto dark:block"
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarUser
          user={{
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl,
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
