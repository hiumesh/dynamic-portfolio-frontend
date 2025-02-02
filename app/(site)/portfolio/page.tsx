import TopNavbar from "@/components/top-navbar";
import { createClient } from "@/lib/supabase/server";
import FilterMenu from "./filter-menu";
import Container from "./container";

export default async function Portfolio() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  const user = data?.user;
  return (
    <>
      <TopNavbar user={user} />
      <main className="pt-14">
        <FilterMenu />
        <Container>
          <div>Container</div>
        </Container>
      </main>
    </>
  );
}
