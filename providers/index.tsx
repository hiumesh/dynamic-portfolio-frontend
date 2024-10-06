import { Toaster } from "@/components/ui/toaster";
import { NextUIProvider } from "@nextui-org/react";

import UseQueryProvider from "./use-query-provider";
import AppContextProvider from "./app-context";

export default function GlobalProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextUIProvider>
      <UseQueryProvider>
        <AppContextProvider>
          <>
            {children}
            <Toaster />
          </>
        </AppContextProvider>
      </UseQueryProvider>
    </NextUIProvider>
  );
}
