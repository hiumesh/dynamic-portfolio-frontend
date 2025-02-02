"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Edit3, Plus } from "lucide-react";
import { useState } from "react";
import { useBlogContext } from "./context";

export default function Header() {
  const { showBlogForm, showBlogMetaDataForm } = useBlogContext();

  return (
    <header className="flex py-1.5 shrink-0 items-center justify-between border-b px-4 gap-2 mb-3 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-6" />
        <h1 className="text-lg">Blogs</h1>
      </div>
      <div className="flex items-center gap-3">
        <Button
          className="h-min px-3 py-1.5 gap-1 rounded-full font-normal text-xs"
          onClick={() => showBlogMetaDataForm()}
        >
          <Edit3 /> Edit Meta
        </Button>
        <Button
          className="h-min px-3 py-1.5 gap-1 rounded-full font-normal text-xs"
          onClick={() => showBlogForm()}
        >
          <Plus /> Add New
        </Button>
      </div>
    </header>
  );
}
