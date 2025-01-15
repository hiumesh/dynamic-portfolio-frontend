import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import BasicSection from "./basic-section";
import SkillsSection from "./skills-section";
import AdditionalSection from "./additional-section";
import { get } from "@/services/api/portfolio";
import Header from "./header";

export default async function Portfolio() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["users_portfolio"],
    queryFn: async () => {
      const response = await get();
      if (response.error) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Header />
      <div className="h-full space-y-3">
        <BasicSection />
        <SkillsSection />
        <AdditionalSection />
      </div>
    </HydrationBoundary>
  );
}
