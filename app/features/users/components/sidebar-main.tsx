import { ChevronRight, type LucideIcon } from "lucide-react";
import { Link } from "react-router";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/core/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "~/core/components/ui/sidebar";

export default function SidebarMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      disabled?: boolean;
      comingSoon?: boolean;
    }[];
    comingSoon?: boolean;
    disabled?: boolean;
  }[];
}) {
  return (
    <SidebarGroup>
      {/* <SidebarGroupLabel>Platform</SidebarGroupLabel> */}
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  {item.comingSoon && (
                    <span className="ml-2 rounded bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-600">
                      준비중
                    </span>
                  )}
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        {subItem.disabled ? (
                          <span className="cursor-not-allowed text-gray-400">
                            {subItem.title}
                            {subItem.comingSoon && (
                              <span className="ml-2 rounded bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-600">
                                준비중
                              </span>
                            )}
                          </span>
                        ) : (
                          <Link to={subItem.url} className="hover:underline">
                            <span>{subItem.title}</span>
                            {subItem.comingSoon && (
                              <span className="ml-2 rounded bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-600">
                                준비중
                              </span>
                            )}
                          </Link>
                        )}
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
