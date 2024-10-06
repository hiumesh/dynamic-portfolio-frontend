"use client";

import ProfileCard from "./profile-card";
import { useAppContext } from "@/providers/app-context";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    key: "educations",
    label: "Education",
    url: "/dashboard/educations",
  },
  // {
  //   key: "projects",
  //   label: "Projects",
  //   url: "/dashboard/projects",
  // },
  {
    key: "position_of_responsibility",
    label: "Position of Responsibility",
    url: "/dashboard/positions",
  },
  {
    key: "work_experience",
    label: "Work Experience",
    url: "/dashboard/experiences",
  },
  {
    key: "achievements",
    label: "Achievements",
    url: "/dashboard/achievements",
  },
  {
    key: "certifications",
    label: "Certifications",
    url: "/dashboard/certifications",
  },
];

export default function TabContainer() {
  const { profile } = useAppContext();
  const pathname = usePathname();

  if (!profile) throw new Error("Profile not found!");

  return (
    <div>
      <div className="bg-secondary px-5 pt-3 rounded-md my-3 space-y-5">
        <ProfileCard profile={profile} />
        <div className="flex gap-8 overflow-auto">
          {tabs.map((tab) => (
            <Link
              key={tab.key}
              href={tab.url}
              className={cn(
                "font-normal px-0 relative text-sm text-nowrap py-2",
                tab.url === pathname &&
                  "after:absolute after:w-full after:h-[1px] after:bg-blue-500 after:left-0 after:-bottom-0 text-blue-500 hover:text-blue-400"
              )}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
