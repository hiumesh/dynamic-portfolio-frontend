import { createClient } from "@/lib/supabase/server";

import MainSection from "./main-section";
import Footer from "./footer";
import TopNavbar from "@/components/top-navbar";

export default async function Home() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  const user = data?.user;
  return (
    <>
      <TopNavbar user={user} />
      <MainSection />
      <Footer />
    </>
  );
}
