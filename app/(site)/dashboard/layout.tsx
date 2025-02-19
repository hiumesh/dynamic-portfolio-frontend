"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAppContext } from "@/providers/app-context";
import { usePathname, useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();

  const { profile } = useAppContext();

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

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
