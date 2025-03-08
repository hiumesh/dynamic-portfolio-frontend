"use client";

import { createContext, useContext, useMemo, useState } from "react";

const BlogsContext = createContext<{
  filters: { query?: string };
  updateFilters: (
    filters: { query?: string },
    options?: { merge?: boolean }
  ) => void;
}>({
  filters: {},
  updateFilters: () => {},
});

export default function BlogsContextProvider({
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
    <BlogsContext.Provider value={value}>{children}</BlogsContext.Provider>
  );
}

export function useBlogsContext() {
  return useContext(BlogsContext);
}
