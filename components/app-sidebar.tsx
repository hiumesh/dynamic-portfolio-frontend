"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  GalleryVerticalEnd,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAppContext } from "@/providers/app-context";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Portfolio",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Education",
          url: "/dashboard/educations",
        },
        {
          title: "Work Experience",
          url: "/dashboard/experiences",
        },
        {
          title: "Certifications",
          url: "/dashboard/certifications",
        },
        {
          title: "Hackathons",
          url: "/dashboard/hackathons",
        },
      ],
    },
    {
      title: "Blogs",
      url: "#",
      icon: Bot,
      // items: [
      //   {
      //     title: "Genesis",
      //     url: "#",
      //   },
      //   {
      //     title: "Explorer",
      //     url: "#",
      //   },
      //   {
      //     title: "Quantum",
      //     url: "#",
      //   },
      // ],
    },
    {
      title: "Work Gallery",
      url: "/dashboard/work-gallery",
      icon: BookOpen,
      // items: [
      //   {
      //     title: "Introduction",
      //     url: "#",
      //   },
      //   {
      //     title: "Get Started",
      //     url: "#",
      //   },
      //   {
      //     title: "Tutorials",
      //     url: "#",
      //   },
      //   {
      //     title: "Changelog",
      //     url: "#",
      //   },
      // ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      // items: [
      //   {
      //     title: "General",
      //     url: "#",
      //   },
      //   {
      //     title: "Team",
      //     url: "#",
      //   },
      //   {
      //     title: "Billing",
      //     url: "#",
      //   },
      //   {
      //     title: "Limits",
      //     url: "#",
      //   },
      // ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { profile } = useAppContext();

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* <SidebarHeader>
          <TeamSwitcher teams={data.teams} />
        </SidebarHeader> */}
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            email: profile!.email,
            name: profile?.full_name || undefined,
            avatar: profile?.avatar_url || undefined,
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
