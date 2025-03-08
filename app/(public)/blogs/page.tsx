import { getAll } from "@/services/api/blog";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import BlogsContextProvider from "./context";
import FilterMenu from "./filter-menu";
import ListContainer from "./list-container";

export default async function Blogs() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["blogs", "infinite"],
    queryFn: async () => {
      const response = await getAll({ cursor: 0 });
      if (response.error) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogsContextProvider>
        <FilterMenu />
        <ListContainer />
      </BlogsContextProvider>
    </HydrationBoundary>
  );
}
