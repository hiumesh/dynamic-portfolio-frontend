import TopNavbar from "@/components/top-navbar";
import { createClient } from "@/lib/supabase/server";

export default async function PublicGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  const user = data?.user;
  return (
    <div>
      <TopNavbar user={user} />
      {children}
    </div>
  );
}
