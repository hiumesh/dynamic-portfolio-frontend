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
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["blogs", "infinite", undefined],
    queryFn: async ({ queryKey, pageParam }) => {
      const [, , query] = queryKey;
      const response = await getAll({ cursor: pageParam, query });
      if (response.error) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
    initialPageParam: 0,
    getNextPageParam: (
      lastPage:
        | {
            list: BlogPost[];
            cursor: number;
          }
        | undefined
    ) => lastPage?.cursor,
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
