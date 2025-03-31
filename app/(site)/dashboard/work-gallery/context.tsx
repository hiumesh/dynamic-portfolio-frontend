"use client";

import { createContext, useContext, useMemo, useState } from "react";
import TechProjectFormModal from "./form-modal";
import { WorkGalleryMetaDataFormModal } from "@/components/metadata-forms/work-gallery-metadata-form-modal";

const WorkGalleryContext = createContext<{
  showWorkGalleryForm: (
    id?: number | string,
    onSuccess?: (data?: WorkGalleryItem | TechProject) => void
  ) => void;
  showWorkGalleryMetaDataForm: () => void;
}>({
  showWorkGalleryForm: () => {},
  showWorkGalleryMetaDataForm: () => {},
});

export default function WorkGalleryContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [workGalleryForm, setWorkGalleryForm] = useState<{
    visible: boolean;
    id?: number | string;
    onSuccess?: (data?: WorkGalleryItem | TechProject) => void;
  }>({
    visible: false,
  });

  const [workGalleryMetaDataForm, setWorkGalleryMetaDataForm] = useState<{
    visible: boolean;
  }>({
    visible: false,
  });

  const showWorkGalleryForm = (
    id?: number | string,
    onSuccess?: (data?: WorkGalleryItem | TechProject) => void
  ) => {
    setWorkGalleryForm({ visible: true, id, onSuccess });
  };
  const showWorkGalleryMetaDataForm = () =>
    setWorkGalleryMetaDataForm({ visible: true });
  const value = useMemo(
    () => ({ showWorkGalleryForm, showWorkGalleryMetaDataForm }),
    []
  );
  return (
    <WorkGalleryContext.Provider value={value}>
      {children}
      <TechProjectFormModal
        isOpen={workGalleryForm.visible}
        hide={() => setWorkGalleryForm({ visible: false, id: undefined })}
        projectId={workGalleryForm.id}
        onSuccess={workGalleryForm.onSuccess}
      />
      <WorkGalleryMetaDataFormModal
        isOpen={workGalleryMetaDataForm.visible}
        hide={() => setWorkGalleryMetaDataForm({ visible: false })}
      />
    </WorkGalleryContext.Provider>
  );
}

export function useWorkGalleryContext() {
  return useContext(WorkGalleryContext);
}
