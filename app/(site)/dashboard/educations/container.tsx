"use client";

import { useCallback, useState } from "react";
import EducationFormModal from "./form-modal";
import { showErrorToast } from "@/lib/client-utils";
import {
  reorderUserEducations,
  deleteUserEducation,
} from "@/services/api/educations";
import DashboardTabSortableList, {
  SortableListItem,
} from "@/components/dashboard-tab-sortable-list";
import EducationCard from "./card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Edit3, Plus } from "lucide-react";
import { EducationMetaDataFormModal } from "@/components/metadata-forms/education-metadata-form-modal";

interface PropTypes {
  educations: UserEducations;
}

export default function EducationContainer({ educations }: PropTypes) {
  const [form, setForm] = useState<{
    isOpen: boolean;
    editData: UserEducation | null;
  }>({ isOpen: false, editData: null });
  const [data, setData] = useState(educations);
  const [metadataFormModal, setMetadataFormModal] = useState(false);

  const onRemove = useCallback(async (id: number | string) => {
    try {
      const { error } = await deleteUserEducation(id);
      if (error) {
        showErrorToast(error);
        return false;
      }
      setData((prev) => prev.filter((edu) => edu.id !== id));
      return true;
    } catch (error) {
      showErrorToast(error);
      return false;
    }
  }, []);

  const onReorder = useCallback(
    async (id: number | string, newIndex: number) => {
      try {
        const { error } = await reorderUserEducations(id, newIndex);
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

  const onEdit = useCallback((data: UserEducation) => {
    setForm({ isOpen: true, editData: data });
  }, []);

  const onSuccess = useCallback((data?: UserEducation) => {
    if (data) {
      setData((prev) => {
        const index = prev.findIndex((edu) => edu.id === data.id);
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
          <h1 className="text-lg">Educations</h1>
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
          Card={EducationCard}
        />
        <EducationFormModal
          hide={() => setForm({ ...form, isOpen: false })}
          editData={form.editData}
          onSuccess={onSuccess}
          isOpen={form.isOpen}
        />
        <EducationMetaDataFormModal
          hide={() => setMetadataFormModal(false)}
          isOpen={metadataFormModal}
        />
      </div>
    </>
  );
}
