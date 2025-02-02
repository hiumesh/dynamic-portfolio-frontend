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
  await queryClient.prefetchQuery({
    queryKey: ["users_blogs"],
    queryFn: async () => {
      const response = await get();
      if (response.error) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
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
