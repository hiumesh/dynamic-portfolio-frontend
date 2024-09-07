import { Toaster } from "@/components/ui/toaster";
import UseQueryProvider from "./use-query-provider";

export default function GlobalProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UseQueryProvider>
      <>
        {children}
        <Toaster />
      </>
    </UseQueryProvider>
  );
}
