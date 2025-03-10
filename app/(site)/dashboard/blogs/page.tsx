import { get } from "@/services/api/blog";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Header from "./header";
import BlogContainer from "./blogs-section";
import BlogContextProvider from "./context";

export default async function Blogs() {
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["user_blogs", "infinite"],
    queryFn: async ({ pageParam }) => {
      const response = await get({ cursor: pageParam });
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
      <BlogContextProvider>
        <>
          <Header />
          <div className="h-full space-y-3">
            <BlogContainer />
          </div>
        </>
      </BlogContextProvider>
    </HydrationBoundary>
  );
}
