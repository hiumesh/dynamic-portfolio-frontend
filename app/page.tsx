import { createClient } from "@/lib/supabase/server";

import Navbar from "./navbar";
import MainSection from "./main-section";
import Footer from "./footer";

export default async function Home() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  const user = data?.user;
  return (
    <>
      <Navbar user={user} />
      <MainSection />
      <Footer />
    </>
  );
}
