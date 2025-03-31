"use client";

import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useOptimistic,
  useState,
} from "react";
import { showErrorToast } from "@/lib/client-utils";
import DashboardTabSortableList, {
  SortableListItem,
} from "@/components/dashboard-tab-sortable-list";

import { TechProjectCard } from "./card";
import { get, remove, reorder } from "@/services/api/work-gallery";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useWorkGalleryContext } from "./context";
import { Spinner } from "@heroui/react";
import _ from "lodash";

export default function WorkGalleryContainer() {
  const { showWorkGalleryForm } = useWorkGalleryContext();
  const [ref, inView] = useInView();
  const queryClient = useQueryClient();
  const {
    data,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["user_work_gallery", "infinite"],
    queryFn: async ({ pageParam }) => {
      const response = await get({ cursor: pageParam });
      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage?.cursor,
    refetchOnWindowFocus: false,
    structuralSharing: false,
  });

  const [items, setItems] = useState<TechProject[]>([]);

  // const items = useMemo(() => {
  //   // console.log("running", data);
  //   return data?.pages?.flatMap((page) => page?.list || []) || [];
  // }, [data]);

  // const [optimisticItems, setOptimisticItems] = useOptimistic(
  //   items,
  //   (state, action: any) => {
  //     switch (action.type) {
  //       case "reorder": {
  //         return action.func(state);
  //       }

  //       default: {
  //         return state;
  //       }
  //     }
  //   }
  // );

  const onRemove = useCallback(
    async (id: number | string) => {
      try {
        const { error } = await remove(id);
        if (error) {
          showErrorToast(error);
          return false;
        }
        queryClient.setQueryData(
          ["user_work_gallery", "infinite"],
          (prev: unknown) => {
            if (
              typeof prev === "object" &&
              prev !== null &&
              "pages" in prev &&
              _.isArray(prev?.pages)
            ) {
              let list = prev?.pages?.flatMap((page) => page?.list || []) || [];
              list = list.filter((item) => item.id !== id);

              return {
                ...prev,
                pages: prev?.pages?.map((page) => ({
                  ...page,
                  list: list?.splice(0, page?.list?.length),
                })),
              };
            }
            return prev;
          }
        );
        return true;
      } catch (error) {
        showErrorToast(error);
        return false;
      }
    },
    [queryClient]
  );

  const onReorder = useCallback(
    async (id: number | string, newIndex: number) => {
      try {
        const { error } = await reorder(id, newIndex);
        if (error) {
          showErrorToast(error);
          return false;
        }
        return true;
      } catch (error) {
        showErrorToast(error);
        return false;
      }
    },
    []
  );

  const onSuccess = useCallback(
    (data?: WorkGalleryItem) => {
      if (data) {
        queryClient.setQueryData(
          ["user_work_gallery", "infinite"],
          (prev: unknown) => {
            if (
              typeof prev === "object" &&
              prev !== null &&
              "pages" in prev &&
              _.isArray(prev?.pages)
            ) {
              let list = prev?.pages?.flatMap((page) => page?.list || []) || [];
              const index = list.findIndex((exp) => exp.id === data.id);
              if (index === -1) return prev;
              list = [...list.slice(0, index), data, ...list.slice(index + 1)];

              return {
                ...prev,
                pages: prev?.pages?.map((page) => ({
                  ...page,
                  list: list?.splice(0, page?.list?.length),
                })),
              };
            }
            return prev;
          }
        );
      }
    },
    [queryClient]
  );

  const onEdit = useCallback(
    (data: WorkGalleryItem) => {
      showWorkGalleryForm(data.id, onSuccess);
    },
    [showWorkGalleryForm, onSuccess]
  );

  useEffect(() => {
    if (data) {
      setItems(data?.pages?.flatMap((page) => page?.list || []) || []);
    }
  }, [data]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, inView]);

  const handleListChange = (
    sortItems: (list: SortableListItem[]) => SortableListItem[]
  ) => {
    // startTransition(() => {
    //    setOptimisticItems({ type: "reorder", func: sortItems });
    // });
    setItems((prev) => sortItems([...prev]) as TechProject[]);

    queryClient.setQueryData(
      ["user_work_gallery", "infinite"],
      (prev: unknown) => {
        if (
          typeof prev === "object" &&
          prev !== null &&
          "pages" in prev &&
          _.isArray(prev?.pages)
        ) {
          let list = prev?.pages?.flatMap((page) => page?.list || []) || [];
          list = sortItems(list);

          return {
            ...prev,
            pages: prev?.pages?.map((page) => ({
              ...page,
              list: list?.splice(0, page?.list?.length),
            })),
          };
        }
        return prev;
      }
    );
  };

  if (error) return <div>Something went wrong</div>;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <DashboardTabSortableList
        // list={optimisticItems}
        list={items}
        setList={
          handleListChange as React.Dispatch<
            React.SetStateAction<SortableListItem[]>
          >
        }
        onRemove={onRemove}
        onReorder={onReorder}
        onEdit={onEdit as (data: SortableListItem) => void}
        Card={TechProjectCard}
      />
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
