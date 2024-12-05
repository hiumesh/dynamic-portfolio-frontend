"use client";

import AvatarHeaderWithAction from "@/components/avatar-header-with-action";
import { useCallback, useState } from "react";
import EducationFormModal from "./form-modal";
import { showErrorToast } from "@/lib/client-utils";
import {
  reorderUserEducations,
  deleteUserEducation,
} from "@/services/api/user-educations";
import DashboardTabSortableList, {
  SortableListItem,
} from "@/components/dashboard-tab-sortable-list";
import EducationCard from "./card";

interface PropTypes {
  educations: UserEducations;
}

export default function EducationContainer({ educations }: PropTypes) {
  const [form, setForm] = useState<{
    isOpen: boolean;
    editData: UserEducation | null;
  }>({ isOpen: false, editData: null });
  const [data, setData] = useState(educations);

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
    <div className="space-y-4 mb-20">
      <AvatarHeaderWithAction
        title="Add Education Details"
        subTitle="Your school / college details"
        actionHandler={() => setForm({ ...form, isOpen: true, editData: null })}
      />
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
    </div>
  );
}
