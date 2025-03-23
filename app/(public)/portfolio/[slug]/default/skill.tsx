"use client";

import MaxWidthWrapper from "@/components/max-width-wrapper";
import { getBySlug } from "@/services/api/portfolio";
import { Chip } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function SkillSection() {
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

  const { skills, basic_details } = data;

  return (
    <section className="border-t border-dashed">
      <MaxWidthWrapper>
        <div className="flex flex-row">
          <div className="flex-1 space-y-7 border-r border-dashed py-10 pr-10">
            <h2 className="text-3xl font-bold ">About</h2>
            <p className="text-sm">{basic_details.about}</p>
          </div>
          <div className="flex-1 space-y-7 py-10 pl-10">
            <h2 className="text-3xl font-bold">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills?.map((skill, id) => (
                <Chip key={skill} variant="solid" color="primary" size="lg">
                  {skill}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
