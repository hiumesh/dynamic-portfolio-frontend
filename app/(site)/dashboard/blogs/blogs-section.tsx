"use client";

import BlogCard from "./card";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { get, remove } from "@/services/api/blog";

import { Spinner } from "@heroui/react";
import { useEffect } from "react";
import { showErrorToast } from "@/lib/client-utils";
import { useInView } from "react-intersection-observer";
import { useBlogContext } from "./context";

export default function BlogsSection() {
  const queryClient = useQueryClient();
  const { showBlogForm } = useBlogContext();
  const [ref, inView] = useInView();
  const {
    data,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["user_blogs", "infinite"],
    queryFn: async ({ pageParam }) => {
      const response = await get({ cursor: pageParam });
      if (response.error) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage?.cursor,
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string | number) => {
      const response = await remove(id);
      if (response.error) {
        throw new Error(response.error.message);
      }
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData(["users_blogs", "infinite"], (prev: any) => {
        if (prev && typeof prev === "object" && prev.length)
          return prev.filter((item: any) => item.id !== id);
        return prev;
      });
    },
    onError: (error) => {
      showErrorToast(error);
    },
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  if (error) return <div>Something went wrong</div>;

  return (
    <div>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {data?.pages
          .reduce<BlogPost[]>(
            (prev, curr) => [...prev, ...(curr?.list || [])],
            []
          )
          .map((page) => (
            <BlogCard
              key={page.id}
              data={page}
              onEdit={() => showBlogForm(page.id)}
              onRemove={() => removeMutation.mutate(page.id)}
            />
          ))}
      </div>
      {isFetching || isFetchingNextPage ? (
        <div className="flex flex-col space-y-2 items-center justify-center py-10">
          <Spinner size="sm" />
          <p className="text-sm">Loading...</p>
        </div>
      ) : null}

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
    </div>
  );
}
