"use client";

import AvatarHeaderWithAction from "@/components/avatar-header-with-action";
import { useCallback, useState } from "react";
import { showErrorToast } from "@/lib/client-utils";
import DashboardTabSortableList, {
  SortableListItem,
} from "@/components/dashboard-tab-sortable-list";
import CertificateCard from "./card";
import {
  deleteUserCertification,
  reorderUserCertification,
} from "@/services/api/user-certification";
import CertificateFormModal from "./form-modal";

interface PropTypes {
  certifications: UserCertifications;
}

export default function CertificateContainer({ certifications }: PropTypes) {
  const [form, setForm] = useState<{
    isOpen: boolean;
    editData: UserCertification | null;
  }>({ isOpen: false, editData: null });
  const [data, setData] = useState(certifications);

  const onRemove = useCallback(async (id: number | string) => {
    try {
      const { error } = await deleteUserCertification(id);
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
        const { error } = await reorderUserCertification(id, newIndex);
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

  const onEdit = useCallback((data: UserCertification) => {
    setForm({ isOpen: true, editData: data });
  }, []);

  const onSuccess = useCallback((data?: UserCertification) => {
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
        title="Add Certificate/Course Details"
        subTitle="All Certifications/Courses you have done"
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
        Card={CertificateCard}
      />
      <CertificateFormModal
        hide={() => setForm({ ...form, isOpen: false })}
        editData={form.editData}
        onSuccess={onSuccess}
        isOpen={form.isOpen}
      />
    </div>
  );
}
