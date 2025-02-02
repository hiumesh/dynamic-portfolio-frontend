"use client";

import BlogCard from "./card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { get, remove } from "@/services/api/blog";
import { useBlogContext } from "./context";
import { Spinner } from "@nextui-org/react";
import { useCallback } from "react";
import { showErrorToast } from "@/lib/client-utils";

export default function BlogsSection() {
  const queryClient = useQueryClient();
  const { showBlogForm } = useBlogContext();
  const { data, error, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ["users_blogs"],
    queryFn: async () => {
      const response = await get();
      if (response.error) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
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
      queryClient.setQueryData(["users_blogs"], (prev: any) => {
        if (prev && typeof prev === "object" && prev.length)
          return prev.filter((item: any) => item.id !== id);
        return prev;
      });
    },
    onError: (error) => {
      showErrorToast(error);
    },
  });

  if (error) return <div>Something went wrong</div>;

  return (
    <div>
      {isLoading || isRefetching ? (
        <div className="flex flex-col space-y-2 items-center justify-center py-10">
          <Spinner size="sm" />
          <p className="text-sm">Loading...</p>
        </div>
      ) : null}

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {data?.map((item) => (
          <BlogCard
            key={item.id}
            data={item}
            onEdit={() => showBlogForm(item.id)}
            onRemove={() => removeMutation.mutate(item.id)}
          />
        ))}
      </div>
    </div>
  );
}
