import { getDetailBySlug } from "@/services/api/blog";
import { QueryClient } from "@tanstack/react-query";
import Header from "./header";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import Body from "./body";
import Comments from "./comments";
import ActionMenu from "./menu";

export default async function Blog({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["blog", params.slug],
    queryFn: async () => {
      const response = await getDetailBySlug(params.slug);
      if (response.error) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
  });
  return (
    <section className="p-10">
      <MaxWidthWrapper className="max-w-screen-md">
        <Header />
        <ActionMenu />
        <Body />
        <Comments />
      </MaxWidthWrapper>
    </section>
  );
}
