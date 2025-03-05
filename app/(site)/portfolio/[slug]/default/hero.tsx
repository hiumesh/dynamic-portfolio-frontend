"use client";

import MaxWidthWrapper from "@/components/max-width-wrapper";
import { TextEffect } from "@/components/ui/text-effect";
import { TextLoop } from "@/components/ui/text-loop";
import { getBySlug } from "@/services/api/portfolio";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function HeroSection() {
  const params = useParams<{ slug: string }>();
  const { data, error, isLoading } = useQuery({
    queryKey: ["portfolio_metadata", params.slug],
    queryFn: async () => {
      const response = await getBySlug(params.slug);
      if (response.error) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
    refetchOnWindowFocus: false,
  });

  if (isLoading || !data || error) return null;

  const { basic_details } = data;

  return (
    <section className="py-10">
      <MaxWidthWrapper className="flex">
        <div className="pt-20 space-y-5">
          <div className="flex gap-2">
            <TextEffect
              per="char"
              preset="fade"
              as="h1"
              className="text-6xl font-extrabold"
            >
              Hi,
            </TextEffect>
            <TextEffect
              per="word"
              as="h1"
              preset="blur"
              className="text-6xl font-extrabold"
            >
              {basic_details?.name
                ? `I'm ${basic_details.name.split(" ")[0]}`
                : "Anonymous"}
            </TextEffect>
          </div>
          <h2 className="inline-flex whitespace-pre-wrap text-3xl font-medium">
            I&apos;m&nbsp;
            <TextLoop
              className="overflow-y-clip"
              transition={{
                type: "spring",
                stiffness: 900,
                damping: 80,
                mass: 10,
              }}
              variants={{
                initial: {
                  y: 20,
                  rotateX: 90,
                  opacity: 0,
                  filter: "blur(4px)",
                },
                animate: {
                  y: 0,
                  rotateX: 0,
                  opacity: 1,
                  filter: "blur(0px)",
                },
                exit: {
                  y: -20,
                  rotateX: -90,
                  opacity: 0,
                  filter: "blur(4px)",
                },
              }}
            >
              {basic_details?.work_domains?.map((domain, index) => (
                <span key={index}>{domain}</span>
              ))}
              {!basic_details?.work_domains && (
                <>
                  <span>Unemployed</span>
                  <span>Not found</span>
                </>
              )}
            </TextLoop>
          </h2>
          <TextEffect
            per="line"
            as="p"
            segmentWrapperClassName="overflow-hidden block"
            variants={{
              container: {
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.2 },
                },
              },
              item: {
                hidden: {
                  opacity: 0,
                  y: 40,
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.4,
                  },
                },
              },
            }}
            className="text-lg max-w-md text-gray-700"
          >
            {basic_details?.tagline || "Op's, not found"}
          </TextEffect>
        </div>
        <div></div>
      </MaxWidthWrapper>
    </section>
  );
}
