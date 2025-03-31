import WorkGalleryContextProvider from "./context";
import FilterMenu from "./filter-menu";
import ListContainer from "./list-container";

export default async function Portfolio() {
  return (
    <>
      <WorkGalleryContextProvider>
        <FilterMenu />
        <ListContainer />
      </WorkGalleryContextProvider>
    </>
  );
}
