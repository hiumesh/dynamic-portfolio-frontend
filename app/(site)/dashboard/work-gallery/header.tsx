"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Edit3, Plus } from "lucide-react";
import { useWorkGalleryContext } from "./context";
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import _ from "lodash";

export default function WorkGalleryHeader() {
  const queryClient = useQueryClient();
  const { showWorkGalleryForm, showWorkGalleryMetaDataForm } =
    useWorkGalleryContext();

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

              return {
                ...prev,
                pages: prev?.pages?.map((page, idx) => ({
                  ...page,
                  list:
                    idx === 0
                      ? [data, ...list?.splice(0, page?.list?.length)]
                      : list?.splice(0, page?.list?.length),
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
  return (
    <header className="flex py-1.5 shrink-0 items-center justify-between border-b px-4 gap-2 mb-3 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-6" />
        <h1 className="text-lg">Work Gallery</h1>
      </div>
      <div className="flex items-center gap-3">
        <Button
          className="h-min px-3 py-1.5 gap-1 rounded-full font-normal text-xs"
          onClick={() => showWorkGalleryMetaDataForm()}
        >
          <Edit3 /> Edit Meta
        </Button>
        <Button
          className="h-min px-3 py-1.5 gap-1 rounded-full font-normal text-xs"
          onClick={() => showWorkGalleryForm(undefined, onSuccess)}
        >
          <Plus /> Add New
        </Button>
      </div>
    </header>
  );
}
