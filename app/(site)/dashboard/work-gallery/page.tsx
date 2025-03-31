import { get } from "@/services/api/work-gallery";
import WorkGalleryContainer from "./container";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import WorkGalleryContextProvider from "./context";
import WorkGalleryHeader from "./header";

export default async function WorkGallery() {
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["user_work_gallery", "infinite"],
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
            list: WorkGalleryItems;
            cursor: number;
          }
        | undefined
    ) => lastPage?.cursor,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WorkGalleryContextProvider>
        <div className="h-full space-y-3">
          <WorkGalleryHeader />
          <WorkGalleryContainer />
        </div>
      </WorkGalleryContextProvider>
    </HydrationBoundary>
  );
}
