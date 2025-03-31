"use client";

import MaxWidthWrapper from "@/components/max-width-wrapper";
import { getAll } from "@/services/api/work-gallery";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import WorkGalleryCard, { WorkGalleryCardSkeleton } from "./card";
import { useEffect } from "react";
import { useWorkGalleryContext } from "./context";

export default function ListContainer() {
  const { filters } = useWorkGalleryContext();
  const [ref, inView] = useInView();
  const {
    data,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["work-gallery", "infinite", filters.query],
    queryFn: async ({ queryKey, pageParam }) => {
      const [, , query] = queryKey;
      const response = await getAll({ cursor: pageParam, query });
      if (response.error) {
        throw new Error(response.error.message);
      }
      console.log(response.data);
      return response.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage?.cursor,
  });

  const loadingView = (
    <>
      <WorkGalleryCardSkeleton /> <WorkGalleryCardSkeleton />
      <WorkGalleryCardSkeleton /> <WorkGalleryCardSkeleton />
      <WorkGalleryCardSkeleton /> <WorkGalleryCardSkeleton />
      <WorkGalleryCardSkeleton /> <WorkGalleryCardSkeleton />
    </>
  );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <MaxWidthWrapper>
      {error && (
        <div className="py-3 text-center text-red-400">{error.message}</div>
      )}
      <div className="grid grid-cols-3 gap-4">
        {data?.pages
          .reduce<WorkGalleryItem[]>(
            (prev, curr) => [...prev, ...(curr?.list || [])],
            []
          )
          .map((page) => (
            <WorkGalleryCard key={page.id} data={page} />
          ))}

        {isFetching || isFetchingNextPage ? loadingView : null}
      </div>
      <div>
        <div
          ref={ref}
          className="text-center text-sm text-muted-foreground py-7 invisible"
        >
          {isFetchingNextPage
            ? "Fetching next page..."
            : hasNextPage
            ? "Fetch More Data"
            : "No more data"}
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
