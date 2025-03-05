"use client";

import { createContext, useContext, useMemo, useState } from "react";

const PortfolioContext = createContext<{
  filters: { query?: string };
  updateFilters: (
    filters: { query?: string },
    options?: { merge?: boolean }
  ) => void;
}>({
  filters: {},
  updateFilters: () => {},
});

export default function PortfolioContextProvider({
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
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolioContext() {
  return useContext(PortfolioContext);
}
