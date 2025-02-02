"use client";

import { createContext, useContext, useMemo, useState } from "react";
import BlogsFormModal from "./form-modal";
import { BlogMetaDataFormModal } from "@/components/metadata-forms/blog-metadata-form-modal";

const BlogContext = createContext<{
  showBlogForm: (id?: number | string) => void;
  showBlogMetaDataForm: () => void;
}>({
  showBlogForm: () => {},
  showBlogMetaDataForm: () => {},
});

export default function BlogContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [blogForm, setBlogForm] = useState<{
    visible: boolean;
    id?: number | string;
  }>({
    visible: false,
  });

  const [blogMetaDataForm, setBlogMetaDataForm] = useState<{
    visible: boolean;
  }>({
    visible: false,
  });

  const showBlogForm = (id?: number | string) => {
    setBlogForm({ visible: true, id });
  };
  const showBlogMetaDataForm = () => setBlogMetaDataForm({ visible: true });
  const value = useMemo(() => ({ showBlogForm, showBlogMetaDataForm }), []);
  return (
    <BlogContext.Provider value={value}>
      {children}
      <BlogsFormModal
        isOpen={blogForm.visible}
        hide={() => setBlogForm({ visible: false, id: undefined })}
        blogId={blogForm.id}
      />
      <BlogMetaDataFormModal
        isOpen={blogMetaDataForm.visible}
        hide={() => setBlogMetaDataForm({ visible: false })}
      />
    </BlogContext.Provider>
  );
}

export function useBlogContext() {
  return useContext(BlogContext);
}
