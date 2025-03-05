import FilterMenu from "./filter-menu";
import ListContainer from "./list-container";
import PortfolioContextProvider from "./context";

export default async function Portfolio() {
  return (
    <>
      <PortfolioContextProvider>
        <FilterMenu />
        <ListContainer />
      </PortfolioContextProvider>
    </>
  );
}
