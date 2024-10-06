"use client";

import { useAppContext } from "@/providers/app-context";
import { usePathname, useRouter } from "next/navigation";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { profile } = useAppContext();
  const router = useRouter();
  const pathname = usePathname();

  if (profile === undefined || profile === null) return;

  if (
    (profile.full_name === null || profile.slug === null) &&
    pathname !== "/profile-setup"
  )
    return router.replace("/profile-setup");

  if (
    pathname === "/profile-setup" &&
    profile.full_name !== null &&
    profile.slug !== null
  )
    return router.replace("/dashboard");

  return <div>{children}</div>;
}
