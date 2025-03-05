import TopNavbar from "@/components/top-navbar";
import { createClient } from "@/lib/supabase/server";
import FilterMenu from "./filter-menu";
import ListContainer from "./list-container";
import PortfolioContextProvider from "./context";

export default async function Portfolio() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  const user = data?.user;
  return (
    <>
      <TopNavbar user={user} />
      <PortfolioContextProvider>
        <FilterMenu />
        <ListContainer />
      </PortfolioContextProvider>
    </>
  );
}
