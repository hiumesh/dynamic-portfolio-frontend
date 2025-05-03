import { HeroUIProvider, ToastProvider } from "@heroui/react";

import UseQueryProvider from "./use-query-provider";
import AppContextProvider from "./app-context";
import { Toaster } from "sonner";

export default async function GlobalProviders({
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
            <ToastProvider />
          </>
        </AppContextProvider>
      </UseQueryProvider>
    </HeroUIProvider>
  );
}
