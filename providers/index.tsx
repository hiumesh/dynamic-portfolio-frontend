import { HeroUIProvider } from "@heroui/react";

import UseQueryProvider from "./use-query-provider";
import AppContextProvider from "./app-context";
import { Toaster } from "sonner";

export default function GlobalProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HeroUIProvider>
      <UseQueryProvider>
        <AppContextProvider>
          <>
            {children}
            <Toaster />
          </>
        </AppContextProvider>
      </UseQueryProvider>
    </HeroUIProvider>
  );
}
