"use client";

import AvatarHeaderWithAction from "@/components/avatar-header-with-action";
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
} from "@/services/api/user_hackathon";

interface PropTypes {
  hackathons: UserHackathons;
}

export default function HackathonContainer({ hackathons }: PropTypes) {
  const [form, setForm] = useState<{
    isOpen: boolean;
    editData: UserHackathon | null;
  }>({ isOpen: false, editData: null });
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
    <div className="space-y-4 mb-20">
      <AvatarHeaderWithAction
        title="Add Hackathon"
        subTitle="Your Hackathons"
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
        Card={HackathonCard}
      />
      <HackathonFormModal
        hide={() => setForm({ ...form, isOpen: false })}
        editData={form.editData}
        onSuccess={onSuccess}
        isOpen={form.isOpen}
      />
    </div>
  );
}
