"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { showErrorToast } from "@/lib/client-utils";
import { get, publish, takedown } from "@/services/api/portfolio";
import { Chip, Spinner } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import _ from "lodash";
import { Loader2, SendHorizontal } from "lucide-react";

const statusMap: { [key: string]: string } = {
  ACTIVE: "Active",
  IN_ACTIVE: "In Active",
};

export default function Header() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["users_portfolio"],
    queryFn: async () => {
      const response = await get();
      if (response.error) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
  });

  const publishMutation = useMutation({
    mutationFn: async () => {
      const response = await publish();
      if (response.error) {
        throw new Error(response.error.message);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.setQueryData(["users_portfolio"], (prev: any) => {
        if (prev && typeof prev === "object")
          return { ...prev, status: "ACTIVE" };
        return prev;
      });
    },
    onError: (error) => {
      showErrorToast(error);
    },
  });

  const takedownMutation = useMutation({
    mutationFn: async () => {
      const response = await takedown();
      if (response.error) {
        throw new Error(response.error.message);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.setQueryData(["users_portfolio"], (prev: any) => {
        if (prev && typeof prev === "object")
          return { ...prev, status: "IN_ACTIVE" };
        return prev;
      });
    },
    onError: (error) => {
      showErrorToast(error);
    },
  });

  const portfolio = data as Portfolio;

  return (
    <header className="flex py-1.5 shrink-0 items-center justify-between border-b px-4 gap-2 mb-3 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-6" />
        <h1 className="text-lg">Portfolio</h1>
        {isLoading ? <Spinner /> : null}
        {!isLoading && portfolio ? (
          <Chip size="sm" color="primary">
            {_.capitalize(
              portfolio.status in statusMap
                ? statusMap[portfolio.status]
                : portfolio.status
            )}
          </Chip>
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        {["IN_ACTIVE", "DRAFT"].includes(portfolio?.status) ? (
          <Button
            className="h-min px-3 py-1.5 gap-1 rounded-full font-normal text-xs"
            disabled={publishMutation.isPending}
            onClick={() => publishMutation.mutate()}
          >
            {publishMutation.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <SendHorizontal size={16} strokeWidth={1.5} />
            )}
            Publish
          </Button>
        ) : null}

        {["ACTIVE"].includes(portfolio?.status) ? (
          <Button
            className="h-min px-3 py-1.5 gap-1 rounded-full font-normal text-xs"
            onClick={() => takedownMutation.mutate()}
            disabled={takedownMutation.isPending}
          >
            {takedownMutation.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <SendHorizontal size={16} strokeWidth={1.5} />
            )}
            Take Down
          </Button>
        ) : null}
      </div>
    </header>
  );
}
