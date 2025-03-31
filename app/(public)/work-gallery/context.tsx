"use client";

import { createContext, useContext, useMemo, useState } from "react";

const WorkGalleryContext = createContext<{
  filters: { query?: string };
  updateFilters: (
    filters: { query?: string },
    options?: { merge?: boolean }
  ) => void;
}>({
  filters: {},
  updateFilters: () => {},
});

export default function WorkGalleryContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [filters, setFilters] = useState({});

  const updateFilters = (
    filters: { query?: string },
    options: { merge?: boolean } = { merge: false }
  ) => {
    if (options.merge) {
      setFilters((prev) => ({ ...prev, ...filters }));
      return;
    }
    setFilters((prev) => ({ ...filters }));
  };

  const value = useMemo(() => ({ filters, updateFilters }), [filters]);
  return (
    <WorkGalleryContext.Provider value={value}>
      {children}
    </WorkGalleryContext.Provider>
  );
}

export function useWorkGalleryContext() {
  return useContext(WorkGalleryContext);
}
