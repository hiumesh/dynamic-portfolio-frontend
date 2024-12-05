"use client";

import AvatarHeaderWithAction from "@/components/avatar-header-with-action";
import { useCallback, useState } from "react";
import ExperienceFormModal from "./form-modal";
import { showErrorToast } from "@/lib/client-utils";
import DashboardTabSortableList, {
  SortableListItem,
} from "@/components/dashboard-tab-sortable-list";
import ExperienceCard from "./card";
import {
  deleteUserWorkExperience,
  reorderUserWorkExperiences,
} from "@/services/api/user_experience";

interface PropTypes {
  experiences: UserWorkExperiences;
}

export default function ExperienceContainer({ experiences }: PropTypes) {
  const [form, setForm] = useState<{
    isOpen: boolean;
    editData: UserWorkExperience | null;
  }>({ isOpen: false, editData: null });
  const [data, setData] = useState(experiences);

  const onRemove = useCallback(async (id: number | string) => {
    try {
      const { error } = await deleteUserWorkExperience(id);
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
        const { error } = await reorderUserWorkExperiences(id, newIndex);
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

  const onEdit = useCallback((data: UserWorkExperience) => {
    setForm({ isOpen: true, editData: data });
  }, []);

  const onSuccess = useCallback((data?: UserWorkExperience) => {
    if (data) {
      setData((prev) => {
        console.log("data", data);
        const index = prev.findIndex((exp) => exp.id === data.id);
        if (index === -1) return [data, ...prev];
        return [...prev.slice(0, index), data, ...prev.slice(index + 1)];
      });
    }
  }, []);

  return (
    <div className="space-y-4 mb-20">
      <AvatarHeaderWithAction
        title="Add Work Experience"
        subTitle="Your previous internship / full time experiences"
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
        Card={ExperienceCard}
      />
      <ExperienceFormModal
        hide={() => setForm({ ...form, isOpen: false })}
        editData={form.editData}
        onSuccess={onSuccess}
        isOpen={form.isOpen}
      />
    </div>
  );
}
