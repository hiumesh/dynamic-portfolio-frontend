"use client";

import { useCallback, useState } from "react";
import HackathonFormModal from "./form-modal";
import { showErrorToast } from "@/lib/client-utils";
import DashboardTabSortableList, {
  SortableListItem,
} from "@/components/dashboard-tab-sortable-list";
import HackathonCard from "./card";
import {
  deleteUserHackathon,
  reorderUserHackathons,
} from "@/services/api/hackathon";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Edit3, Plus } from "lucide-react";
import { HackathonMetaDataFormModal } from "@/components/metadata-forms/hackathon-metadata-form-modal";

interface PropTypes {
  hackathons: UserHackathons;
}

export default function HackathonContainer({ hackathons }: PropTypes) {
  const [form, setForm] = useState<{
    isOpen: boolean;
    editData: UserHackathon | null;
  }>({ isOpen: false, editData: null });
  const [metadataFormModal, setMetadataFormModal] = useState(false);
  const [data, setData] = useState(hackathons);

  const onRemove = useCallback(async (id: number | string) => {
    try {
      const { error } = await deleteUserHackathon(id);
      if (error) {
        showErrorToast(error);
        return false;
      }
      setData((prev) => prev.filter((ha) => ha.id !== id));
      return true;
    } catch (error) {
      showErrorToast(error);
      return false;
    }
  }, []);

  const onReorder = useCallback(
    async (id: number | string, newIndex: number) => {
      try {
        const { error } = await reorderUserHackathons(id, newIndex);
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

  const onEdit = useCallback((data: UserHackathon) => {
    setForm({ isOpen: true, editData: data });
  }, []);

  const onSuccess = useCallback((data?: UserHackathon) => {
    if (data) {
      setData((prev) => {
        const index = prev.findIndex((exp) => exp.id === data.id);
        if (index === -1) return [data, ...prev];
        return [...prev.slice(0, index), data, ...prev.slice(index + 1)];
      });
    }
  }, []);

  return (
    <>
      <header className="flex py-1.5 shrink-0 items-center justify-between border-b px-4 gap-2 mb-3 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-6" />
          <h1 className="text-lg">Hackathons</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button
            className="h-min px-3 py-1.5 gap-1 rounded-full font-normal text-xs"
            onClick={() => setMetadataFormModal(true)}
          >
            <Edit3 /> Edit Meta
          </Button>
          <Button
            className="h-min px-3 py-1.5 gap-1 rounded-full font-normal text-xs"
            onClick={() => setForm({ ...form, isOpen: true, editData: null })}
          >
            <Plus /> Add New
          </Button>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <DashboardTabSortableList
          list={data}
          setList={
            setData as React.Dispatch<React.SetStateAction<SortableListItem[]>>
          }
          onRemove={onRemove}
          onReorder={onReorder}
          onEdit={onEdit as (data: SortableListItem) => void}
          Card={HackathonCard}
        />
      </div>
      <HackathonFormModal
        hide={() => setForm({ ...form, isOpen: false })}
        editData={form.editData}
        onSuccess={onSuccess}
        isOpen={form.isOpen}
      />
      <HackathonMetaDataFormModal
        hide={() => setMetadataFormModal(false)}
        isOpen={metadataFormModal}
      />
    </>
  );
}
